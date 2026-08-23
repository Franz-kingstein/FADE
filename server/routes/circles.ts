import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken, requireCircleMember } from '../middleware/auth.js';

const router = Router();

// POST /api/v1/circles — Create a new circle
router.post('/', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, data: null, error: 'Circle name required' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert circle
    const circleRes = await client.query(
      `INSERT INTO circles (name, owner_id) VALUES ($1, $2) RETURNING *`,
      [name, req.user.id]
    );
    const newCircle = circleRes.rows[0];

    // 2. Automatically add owner as an active member
    await client.query(
      `INSERT INTO circle_members (circle_id, user_id, is_active) VALUES ($1, $2, TRUE)`,
      [newCircle.id, req.user.id]
    );

    await client.query('COMMIT');
    return res.status(201).json({
      success: true,
      data: newCircle,
      error: null
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error creating circle:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// GET /api/v1/circles/mine — Get all circles user belongs to
router.get('/mine', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const circlesRes = await pool.query(
      `SELECT c.id, c.name, c.owner_id, c.created_at 
       FROM circles c
       JOIN circle_members cm ON c.id = cm.circle_id
       WHERE cm.user_id = $1 AND cm.is_active = TRUE`,
      [req.user.id]
    );

    return res.json({
      success: true,
      data: circlesRes.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching user circles:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/circles/:id/members — Get all members of a circle
router.get('/:id/members', authenticateToken, requireCircleMember, async (req, res) => {
  const circleId = req.params.id;

  try {
    const membersRes = await pool.query(
      `SELECT u.id, u.name, u.email, u.profile_photo_url, u.aesthetic_style, cm.joined_at, cm.is_active
       FROM users u
       JOIN circle_members cm ON u.id = cm.user_id
       WHERE cm.circle_id = $1`,
      [circleId]
    );

    return res.json({
      success: true,
      data: membersRes.rows,
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching circle members:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// DELETE /api/v1/circles/:id/members/:userId — Remove a member
router.delete('/:id/members/:userId', authenticateToken, requireCircleMember, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const circleId = req.params.id;
  const targetUserId = req.params.userId;

  try {
    // 1. Verify that the requester is the owner of the circle (or is removing themselves)
    const circleOwnerRes = await pool.query(
      `SELECT owner_id FROM circles WHERE id = $1`,
      [circleId]
    );

    if (circleOwnerRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'Circle not found' });
    }

    const ownerId = circleOwnerRes.rows[0].owner_id;
    if (ownerId !== req.user.id && targetUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Only the circle owner can remove other members'
      });
    }

    if (ownerId === targetUserId) {
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Owner cannot leave or be removed from the circle. Delete the circle instead.'
      });
    }

    // 2. Remove member
    const deleteRes = await pool.query(
      `DELETE FROM circle_members WHERE circle_id = $1 AND user_id = $2 RETURNING *`,
      [circleId, targetUserId]
    );

    if (deleteRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'Member not found in this circle' });
    }

    return res.json({
      success: true,
      data: { message: 'Member successfully removed' },
      error: null
    });
  } catch (error: any) {
    console.error('Error removing member:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
