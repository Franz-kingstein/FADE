import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET and JWT_REFRESH_SECRET environment variables are required');
}

// Register with invite token
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    inviteToken,
    aestheticStyle,
    bodyShape,
    skinUndertone,
    seasonalColorProfile,
    somatotype
  } = req.body;

  if (!name || !email || !password || !inviteToken) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Missing required registration fields'
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Validate invite token
    const tokenRes = await client.query(
      `SELECT * FROM invite_tokens WHERE token = $1`,
      [inviteToken]
    );

    if (tokenRes.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid invite token'
      });
    }

    const tokenData = tokenRes.rows[0];
    if (tokenData.is_used) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invite token has already been used'
      });
    }

    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt.getTime() < Date.now()) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invite token has expired'
      });
    }

    // 2. Check if user already exists
    const userExists = await client.query('SELECT 1 FROM users WHERE email = $1', [email]);
    if (userExists.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Email already registered'
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Create user
    const userInsertRes = await client.query(
      `INSERT INTO users (
        name, email, password_hash, aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, aesthetic_style, body_shape, skin_undertone, seasonal_color_profile, somatotype, created_at`,
      [name, email, passwordHash, aestheticStyle, bodyShape, skinUndertone, seasonalColorProfile, somatotype]
    );
    const newUser = userInsertRes.rows[0];

    // 5. Mark invite token as used and record who used it
    await client.query(
      `UPDATE invite_tokens SET is_used = TRUE, used_by = $1 WHERE id = $2`,
      [newUser.id, tokenData.id]
    );

    // 6. Automatically join the new user to the circle that they were invited to
    await client.query(
      `INSERT INTO circle_members (circle_id, user_id, is_active) VALUES ($1, $2, TRUE) ON CONFLICT DO NOTHING`,
      [tokenData.circle_id, newUser.id]
    );

    await client.query('COMMIT');

    // Generate tokens
    const accessToken = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: newUser.id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          aestheticStyle: newUser.aesthetic_style,
          bodyShape: newUser.body_shape,
          skinUndertone: newUser.skin_undertone,
          seasonalColorProfile: newUser.seasonal_color_profile,
          somatotype: newUser.somatotype,
          createdAt: newUser.created_at
        }
      },
      error: null
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      data: null,
      error: error.message || 'Internal server error during registration'
    });
  } finally {
    client.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Email and password required'
    });
  }

  try {
    const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password'
      });
    }

    const user = userRes.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        data: null,
        error: 'Invalid email or password'
      });
    }

    const accessToken = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '30d' });

    return res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
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
        }
      },
      error: null
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal server error during login'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  return res.json({
    success: true,
    data: { message: 'Logged out successfully' },
    error: null
  });
});

export default router;
