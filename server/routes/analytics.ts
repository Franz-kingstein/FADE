import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/analytics/style-stats — Top aesthetic, avg score over time
router.get('/style-stats', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    // 1. Get user profile aesthetic
    const userRes = await pool.query('SELECT aesthetic_style FROM users WHERE id = $1', [req.user.id]);
    const topAesthetic = userRes.rowCount > 0 ? userRes.rows[0].aesthetic_style : 'Minimalist';

    // 2. Average scores
    const overallRes = await pool.query(
      `SELECT 
         COUNT(*) as total_looks,
         COALESCE(AVG(ai_score_overall), 0) as avg_overall_score,
         COALESCE(AVG(ai_score_color_harmony), 0) as avg_color_score,
         COALESCE(AVG(ai_score_silhouette_fit), 0) as avg_silhouette_score
       FROM outfit_submissions 
       WHERE user_id = $1`,
      [req.user.id]
    );

    const stats = overallRes.rows[0];

    // 3. Average overall score by month
    const monthlyRes = await pool.query(
      `SELECT TO_CHAR(submitted_at, 'YYYY-MM') as month, AVG(ai_score_overall) as avg_score
       FROM outfit_submissions
       WHERE user_id = $1
       GROUP BY month
       ORDER BY month ASC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: {
        topAesthetic,
        totalLooks: parseInt(stats.total_looks, 10),
        avgOverallScore: Number(stats.avg_overall_score).toFixed(2),
        avgColorScore: Number(stats.avg_color_score).toFixed(2),
        avgSilhouetteScore: Number(stats.avg_silhouette_score).toFixed(2),
        monthlyTrends: monthlyRes.rows
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching style stats:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/analytics/look-calendar — Outfit submissions mapped by date
router.get('/look-calendar', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const calendarRes = await pool.query(
      `SELECT id, image_url, occasion_tag, ai_score_overall, submitted_at,
         TO_CHAR(submitted_at, 'YYYY-MM-DD') as date_str
       FROM outfit_submissions 
       WHERE user_id = $1 
       ORDER BY submitted_at DESC`,
      [req.user.id]
    );

    // Group by date_str for easy client consumption
    const grouped: { [key: string]: any[] } = {};
    for (const row of calendarRes.rows) {
      if (!grouped[row.date_str]) {
        grouped[row.date_str] = [];
      }
      grouped[row.date_str].push({
        id: row.id,
        imageUrl: row.image_url,
        occasionTag: row.occasion_tag,
        aiScoreOverall: row.ai_score_overall,
        submittedAt: row.submitted_at
      });
    }

    return res.json({
      success: true,
      data: grouped,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching look calendar:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/analytics/trend-report — Score trends across weeks
router.get('/trend-report', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const trendRes = await pool.query(
      `SELECT 
         TO_CHAR(DATE_TRUNC('week', submitted_at), 'YYYY-"W"IW') as week_str,
         AVG(ai_score_overall) as avg_score_overall,
         AVG(ai_score_color_harmony) as avg_color_harmony,
         AVG(ai_score_silhouette_fit) as avg_silhouette_fit,
         COUNT(*) as look_count
       FROM outfit_submissions
       WHERE user_id = $1 AND submitted_at >= NOW() - INTERVAL '8 weeks'
       GROUP BY DATE_TRUNC('week', submitted_at)
       ORDER BY DATE_TRUNC('week', submitted_at) ASC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: trendRes.rows.map(row => ({
        week: row.week_str,
        avgScoreOverall: Number(row.avg_score_overall).toFixed(2),
        avgColorHarmony: Number(row.avg_color_harmony).toFixed(2),
        avgSilhouetteFit: Number(row.avg_silhouette_fit).toFixed(2),
        lookCount: parseInt(row.look_count, 10)
      })),
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching trend report:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
