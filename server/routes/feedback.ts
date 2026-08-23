import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';
import { notifyCircle } from '../services/realtime.js';

const router = Router();

// Helper to check circle membership of outfit submission
async function verifyOutfitCircleMember(userId: string, submissionId: string) {
  const submissionRes = await pool.query(
    `SELECT circle_id, user_id FROM outfit_submissions WHERE id = $1`,
    [submissionId]
  );
  if (submissionRes.rowCount === 0) {
    return { error: 'Outfit submission not found', status: 404, data: null };
  }

  const { circle_id: circleId, user_id: authorId } = submissionRes.rows[0];

  const memberCheck = await pool.query(
    `SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND is_active = TRUE`,
    [circleId, userId]
  );

  if (memberCheck.rowCount === 0) {
    return { error: 'Access denied: You are not a member of the circle this outfit belongs to', status: 403, data: null };
  }

  return { error: null, status: 200, data: { circleId, authorId } };
}

// POST /api/v1/feedback/:submissionId — Submit feedback
router.post('/:submissionId', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const submissionId = req.params.submissionId;
  const {
    ratingOverall,
    ratingFit,
    ratingColor,
    ratingVibe,
    ratingOccasion,
    feedbackTag,
    textComment,
    voiceNoteUrl
  } = req.body;

  // Validate ratings are present and in range (1-10)
  const ratings = [ratingOverall, ratingFit, ratingColor, ratingVibe, ratingOccasion];
  for (const r of ratings) {
    if (r === undefined || r === null || typeof r !== 'number' || r < 1 || r > 10) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'All ratings (overall, fit, color, vibe, occasion) must be integers between 1 and 10'
      });
    }
  }

  if (!feedbackTag || !['Elevate', 'Appreciate'].includes(feedbackTag)) {
    return res.status(400).json({
      success: false,
      data: null,
      error: "feedbackTag is required and must be either 'Elevate' or 'Appreciate'"
    });
  }

  try {
    // 1. Verify circle membership
    const verify = await verifyOutfitCircleMember(req.user.id, submissionId);
    if (verify.error) {
      return res.status(verify.status).json({ success: false, data: null, error: verify.error });
    }

    // 2. Insert feedback
    const insertRes = await pool.query(
      `INSERT INTO friend_feedback (
        submission_id, reviewer_id, rating_overall, rating_fit, rating_color, rating_vibe, rating_occasion, feedback_tag, text_comment, voice_note_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (submission_id, reviewer_id)
       DO UPDATE SET
         rating_overall = EXCLUDED.rating_overall,
         rating_fit = EXCLUDED.rating_fit,
         rating_color = EXCLUDED.rating_color,
         rating_vibe = EXCLUDED.rating_vibe,
         rating_occasion = EXCLUDED.rating_occasion,
         feedback_tag = EXCLUDED.feedback_tag,
         text_comment = EXCLUDED.text_comment,
         voice_note_url = EXCLUDED.voice_note_url,
         submitted_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        submissionId, req.user.id, ratingOverall, ratingFit, ratingColor, ratingVibe, ratingOccasion, feedbackTag, textComment, voiceNoteUrl
      ]
    );

    const feedback = insertRes.rows[0];

    // 3. Notify circle members via WebSocket
    const notificationPayload = {
      type: 'NEW_FEEDBACK',
      data: {
        feedbackId: feedback.id,
        submissionId: feedback.submission_id,
        reviewerId: req.user.id,
        reviewerName: req.user.email.split('@')[0],
        ratingOverall: feedback.rating_overall,
        feedbackTag: feedback.feedback_tag,
        textComment: feedback.text_comment,
        voiceNoteUrl: feedback.voice_note_url
      }
    };
    if (verify.data) {
      await notifyCircle(verify.data.circleId, notificationPayload, req.user.id);
    }

    return res.status(201).json({
      success: true,
      data: feedback,
      error: null
    });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/feedback/:submissionId — Get all feedback
router.get('/:submissionId', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const submissionId = req.params.submissionId;

  try {
    // Verify circle membership
    const verify = await verifyOutfitCircleMember(req.user.id, submissionId);
    if (verify.error) {
      return res.status(verify.status).json({ success: false, data: null, error: verify.error });
    }

    const feedbacks = await pool.query(
      `SELECT f.*, u.name as reviewer_name, u.profile_photo_url as reviewer_photo 
       FROM friend_feedback f
       JOIN users u ON f.reviewer_id = u.id
       WHERE f.submission_id = $1 ORDER BY f.submitted_at DESC`,
      [submissionId]
    );

    return res.json({
      success: true,
      data: feedbacks.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching feedbacks:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/feedback/:submissionId/average — Get averaged scores
router.get('/:submissionId/average', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const submissionId = req.params.submissionId;

  try {
    // Verify circle membership
    const verify = await verifyOutfitCircleMember(req.user.id, submissionId);
    if (verify.error) {
      return res.status(verify.status).json({ success: false, data: null, error: verify.error });
    }

    const avgRes = await pool.query(
      `SELECT 
         COALESCE(AVG(rating_overall), 0) as avg_overall,
         COALESCE(AVG(rating_fit), 0) as avg_fit,
         COALESCE(AVG(rating_color), 0) as avg_color,
         COALESCE(AVG(rating_vibe), 0) as avg_vibe,
         COALESCE(AVG(rating_occasion), 0) as avg_occasion,
         COUNT(*) as feedback_count
       FROM friend_feedback
       WHERE submission_id = $1`,
      [submissionId]
    );

    const averages = avgRes.rows[0];

    return res.json({
      success: true,
      data: {
        avgOverall: Number(averages.avg_overall).toFixed(1),
        avgFit: Number(averages.avg_fit).toFixed(1),
        avgColor: Number(averages.avg_color).toFixed(1),
        avgVibe: Number(averages.avg_vibe).toFixed(1),
        avgOccasion: Number(averages.avg_occasion).toFixed(1),
        feedbackCount: parseInt(averages.feedback_count, 10)
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error calculating averages:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
