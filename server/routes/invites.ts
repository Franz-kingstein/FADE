import { Router } from 'express';
import crypto from 'crypto';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/invites/generate — Generate a new single-use token
router.post('/generate', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const { circleId } = req.body;
  if (!circleId) {
    return res.status(400).json({ success: false, data: null, error: 'circleId required' });
  }

  try {
    // 1. Verify that the requester is a member of the circle
    const memberCheck = await pool.query(
      `SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND is_active = TRUE`,
      [circleId, req.user.id]
    );

    if (memberCheck.rowCount === 0) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Only active members of a circle can generate invite tokens'
      });
    }

    // 2. Generate token (cryptographically random string)
    const token = crypto.randomBytes(16).toString('hex');
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now

    // 3. Insert into invite_tokens
    const insertRes = await pool.query(
      `INSERT INTO invite_tokens (circle_id, generated_by, token, expires_at) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [circleId, req.user.id, token, expiresAt]
    );

    return res.status(201).json({
      success: true,
      data: insertRes.rows[0],
      error: null
    });
  } catch (error: any) {
    console.error('Error generating invite token:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/invites/:token/validate — Check if token is valid/unused
router.get('/:token/validate', async (req, res) => {
  const tokenStr = req.params.token;

  try {
    const tokenRes = await pool.query(
      `SELECT * FROM invite_tokens WHERE token = $1`,
      [tokenStr]
    );

    if (tokenRes.rowCount === 0) {
      return res.json({
        success: true,
        data: { isValid: false, reason: 'Token not found' },
        error: null
      });
    }

    const invite = tokenRes.rows[0];
    if (invite.is_used) {
      return res.json({
        success: true,
        data: { isValid: false, reason: 'Token already used' },
        error: null
      });
    }

    const expiresAt = new Date(invite.expires_at);
    if (expiresAt.getTime() < Date.now()) {
      return res.json({
        success: true,
        data: { isValid: false, reason: 'Token expired' },
        error: null
      });
    }

    // Also get circle info
    const circleRes = await pool.query('SELECT name FROM circles WHERE id = $1', [invite.circle_id]);
    const circleName = circleRes.rowCount > 0 ? circleRes.rows[0].name : 'Unknown Circle';

    return res.json({
      success: true,
      data: {
        isValid: true,
        circleId: invite.circle_id,
        circleName,
        expiresAt: invite.expires_at
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error validating token:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// POST /api/v1/invites/redeem — Redeem token to join a circle
router.post('/redeem', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, data: null, error: 'Invite token required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch token
    const tokenRes = await client.query(`SELECT * FROM invite_tokens WHERE token = $1 FOR UPDATE`, [token]);
    if (tokenRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, data: null, error: 'Invalid invite token' });
    }

    const invite = tokenRes.rows[0];
    if (invite.is_used) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, data: null, error: 'Invite token already used' });
    }

    const expiresAt = new Date(invite.expires_at);
    if (expiresAt.getTime() < Date.now()) {
      await client.query('ROLLBACK');
      return res.status(400).json({ success: false, data: null, error: 'Invite token expired' });
    }

    // 2. Add member to circle
    await client.query(
      `INSERT INTO circle_members (circle_id, user_id, is_active) 
       VALUES ($1, $2, TRUE) ON CONFLICT (circle_id, user_id) 
       DO UPDATE SET is_active = TRUE`,
      [invite.circle_id, req.user.id]
    );

    // 3. Mark token as used
    await client.query(
      `UPDATE invite_tokens SET is_used = TRUE, used_by = $1 WHERE id = $2`,
      [req.user.id, invite.id]
    );

    await client.query('COMMIT');

    return res.json({
      success: true,
      data: { circleId: invite.circle_id, message: 'Successfully joined circle' },
      error: null
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error redeeming invite token:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
