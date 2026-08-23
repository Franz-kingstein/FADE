import { Router } from 'express';
import pool from '../db.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET /api/v1/users/me — Get own profile
router.get('/me', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  try {
    const userRes = await pool.query(
      `SELECT id, name, email, profile_photo_url, aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype, created_at 
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'User not found' });
    }

    const user = userRes.rows[0];
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhotoUrl: user.profile_photo_url,
        aestheticStyle: user.aesthetic_style,
        bodyShape: user.body_shape,
        skinUndertone: user.skin_undertone,
        seasonalColorProfile: user.seasonal_color_profile,
        somatotype: user.somatotype,
        createdAt: user.created_at
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching own profile:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// PUT /api/v1/users/me — Update profile
router.put('/me', authenticateToken, async (req, res) => {
  if (!req.user) return res.status(401).json({ success: false, data: null, error: 'Unauthenticated' });

  const {
    name,
    profilePhotoUrl,
    aestheticStyle,
    bodyShape,
    skinUndertone,
    seasonalColorProfile,
    somatotype
  } = req.body;

  try {
    // Perform update
    const updateRes = await pool.query(
      `UPDATE users SET 
        name = COALESCE($1, name),
        profile_photo_url = COALESCE($2, profile_photo_url),
        aesthetic_style = COALESCE($3, aesthetic_style),
        body_shape = COALESCE($4, body_shape),
        skin_undertone = COALESCE($5, skin_undertone),
        seasonal_color_profile = COALESCE($6, seasonal_color_profile),
        somatotype = COALESCE($7, somatotype)
       WHERE id = $8
       RETURNING id, name, email, profile_photo_url, aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype, created_at`,
      [name, profilePhotoUrl, aestheticStyle, bodyShape, skinUndertone, seasonalColorProfile, somatotype, req.user.id]
    );

    if (updateRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'User not found' });
    }

    const user = updateRes.rows[0];
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        profilePhotoUrl: user.profile_photo_url,
        aestheticStyle: user.aesthetic_style,
        bodyShape: user.body_shape,
        skinUndertone: user.skin_undertone,
        seasonalColorProfile: user.seasonal_color_profile,
        somatotype: user.somatotype,
        createdAt: user.created_at
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

// GET /api/v1/users/:id — Get another user's public profile
router.get('/:id', authenticateToken, async (req, res) => {
  const targetUserId = req.params.id;

  try {
    const userRes = await pool.query(
      `SELECT id, name, profile_photo_url, aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype, created_at
       FROM users WHERE id = $1`,
      [targetUserId]
    );

    if (userRes.rowCount === 0) {
      return res.status(404).json({ success: false, data: null, error: 'User not found' });
    }

    const user = userRes.rows[0];
    return res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        profilePhotoUrl: user.profile_photo_url,
        aestheticStyle: user.aesthetic_style,
        bodyShape: user.body_shape,
        skinUndertone: user.skin_undertone,
        seasonalColorProfile: user.seasonal_color_profile,
        somatotype: user.somatotype,
        createdAt: user.created_at
      },
      error: null
    });
  } catch (error: any) {
    console.error('Error fetching public user profile:', error);
    return res.status(500).json({ success: false, data: null, error: 'Internal server error' });
  }
});

export default router;
