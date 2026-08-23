import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken, requireCircleMember } from '../middleware/auth.js';
import { upload, validateImageHeader } from '../middleware/upload.js';
import { analyzeOutfit } from '../services/gemini.js';
import { notifyCircle } from '../services/realtime.js';

const router = Router();

// POST /api/v1/outfits — Upload outfit + run Gemini + notify circle
router.post('/', authenticateToken, upload.single('image'), validateImageHeader, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const { occasionTag, circleId } = req.body;
  if (!occasionTag || !circleId) {
    return res.status(400).json({ success: false, data: null, error: 'occasionTag and circleId are required' });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, data: null, error: 'Image file required' });
  }

  const client = await pool.connect();
  try {
    // 1. Check if user is member of the circle
    const memberCheck = await client.query(
      `SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND is_active = TRUE`,
      [circleId, req.user.id]
    );
    if (memberCheck.rowCount === 0) {
      return res.status(403).json({ success: false, data: null, error: 'You are not a member of this circle' });
    }

    // 2. Rate limiting check (max 10 submissions in last 24 hours)
    const rateLimitCheck = await client.query(
      `SELECT count(*) FROM outfit_submissions 
       WHERE user_id = $1 AND submitted_at >= NOW() - INTERVAL '1 day'`,
      [req.user.id]
    );
    const count = parseInt(rateLimitCheck.rows[0].count, 10);
    if (count >= 10) {
      return res.status(429).json({
        success: false,
        data: null,
        error: 'Rate limit exceeded: You can only upload up to 10 outfits per day.'
      });
    }

    // 3. Fetch user styling profile details
    const userProfileRes = await client.query(
      `SELECT aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype 
       FROM users WHERE id = $1`,
      [req.user.id]
    );
    const profile = userProfileRes.rows[0];

    // 4. Run Gemini AI analysis
    const imageUrl = `/uploads/${req.file.filename}`;
    const imagePath = req.file.path;
    const mimeType = req.file.mimetype;

    const aiResult = await analyzeOutfit(imagePath, mimeType, occasionTag, {
      body_shape: profile.body_shape,
      seasonal_color_profile: profile.seasonal_color_profile,
      skin_undertone: profile.skin_undertone,
      somatotype: profile.somatotype,
      aesthetic_style: profile.aesthetic_style
    });

    // 5. Insert outfit submission
    const insertRes = await client.query(
      `INSERT INTO outfit_submissions (
        user_id, image_url, occasion_tag, 
        ai_score_overall, ai_score_color_harmony, ai_score_silhouette_fit, 
        ai_score_occasion_match, ai_score_fabric_appropriateness, 
        ai_feedback_summary, ai_suggested_improvements, 
        palette_flag, palette_flag_reason, circle_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [
        req.user.id, imageUrl, occasionTag,
        aiResult.overall_score, aiResult.color_harmony_score, aiResult.silhouette_fit_score,
        aiResult.occasion_match_score, aiResult.fabric_appropriateness_score,
        aiResult.feedback_summary, aiResult.suggested_improvements,
        aiResult.palette_flag, aiResult.palette_flag_reason, circleId
      ]
    );

    const submission = insertRes.rows[0];

    // 6. Broadcast notification via WebSockets
    const notificationPayload = {
      type: 'NEW_SUBMISSION',
      data: {
        submissionId: submission.id,
        circleId: submission.circle_id,
        userId: req.user.id,
        userName: req.user.email.split('@')[0],
        imageUrl: submission.image_url,
        occasionTag: submission.occasion_tag,
        aiScoreOverall: submission.ai_score_overall,
        submittedAt: submission.submitted_at
      }
    };
    await notifyCircle(circleId, notificationPayload, req.user.id);

    return res.status(201).json({
      success: true,
      data: submission,
      error: null
    });
  } catch (error: any) {
    console.error('Error during outfit submission:', error);
    return res.status(500).json({ success: false, data: null, error: error.message || 'Internal server error' });
  } finally {
    client.release();
  }
});

// GET /api/v1/outfits/mine — Get all my submissions
router.get('/mine', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const resOutfits = await pool.query(
      `SELECT * FROM outfit_submissions WHERE user_id = $1 ORDER BY submitted_at DESC`,
      [req.user.id]
    );
    return res.json({
      success: true,
      data: resOutfits.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching own outfits:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/outfits/:id — Get single submission + all feedback
router.get('/:id', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const submissionId = req.params.id;

  try {
    // 1. Fetch submission
    const submissionRes = await pool.query(
      `SELECT * FROM outfit_submissions WHERE id = $1`,
      [submissionId]
    );

    if (submissionRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'Outfit submission not found' });
    }

    const submission = submissionRes.rows[0];

    // 2. Verify circle membership gating
    const memberCheck = await pool.query(
      `SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND is_active = TRUE`,
      [submission.circle_id, req.user.id]
    );
    if (memberCheck.rowCount === 0) {
      return res.status(403).json({ success: false, data: null, error: 'Access denied: You are not in this circle' });
    }

    // 3. Fetch feedbacks
    const feedbackRes = await pool.query(
      `SELECT f.*, u.name as reviewer_name, u.profile_photo_url as reviewer_photo 
       FROM friend_feedback f
       JOIN users u ON f.reviewer_id = u.id
       WHERE f.submission_id = $1 ORDER BY f.submitted_at DESC`,
      [submissionId]
    );

    return res.json({
      success: true,
      data: {
        submission,
        feedback: feedbackRes.rows
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching single submission:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/outfits/circle/:id — Get all submissions in a circle (feed)
router.get('/circle/:id', authenticateToken, requireCircleMember, async (req, res) => {
  const circleId = req.params.id;

  try {
    const feedRes = await pool.query(
      `SELECT o.*, u.name as user_name, u.profile_photo_url as user_photo,
        (SELECT count(*) FROM friend_feedback WHERE submission_id = o.id) as feedback_count
       FROM outfit_submissions o
       JOIN users u ON o.user_id = u.id
       WHERE o.circle_id = $1
       ORDER BY o.submitted_at DESC`,
      [circleId]
    );

    return res.json({
      success: true,
      data: feedRes.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching circle feed:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// DELETE /api/v1/outfits/:id — Delete submission
router.delete('/:id', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const submissionId = req.params.id;

  try {
    // Delete only if it belongs to requester
    const deleteRes = await pool.query(
      `DELETE FROM outfit_submissions WHERE id = $1 AND user_id = $2 RETURNING *`,
      [submissionId, req.user.id]
    );

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({
        success: false,
        data: null,
        error: 'Submission not found or unauthorized to delete'
      });
    }

    return res.json({
      success: true,
      data: { message: 'Submission deleted successfully' },
      error: null
    });
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
