import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

// Extend Express Request type inline or declare global
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Access token required'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Invalid or expired access token'
      });
    }
    req.user = {
      id: decoded.userId,
      email: decoded.email
    };
    next();
  });
}

// Circle membership checking middleware
export async function requireCircleMember(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Unauthenticated'
    });
  }

  // Find circle ID from route parameters or request body
  // We can look under circleId, id, or the submission's circleId (resolved inside endpoints if needed,
  // but let's check basic parameter mappings here).
  const circleId = req.params.circleId || req.params.id || req.body.circleId;
  
  if (!circleId) {
    return res.status(400).json({
      success: false,
      data: null,
      error: 'Circle ID is required for access verification'
    });
  }

  try {
    const memberCheck = await pool.query(
      `SELECT 1 FROM circle_members WHERE circle_id = $1 AND user_id = $2 AND is_active = TRUE`,
      [circleId, req.user.id]
    );

    if (memberCheck.rowCount === 0) {
      return res.status(403).json({
        success: false,
        data: null,
        error: 'Access denied: You are not a member of this circle'
      });
    }

    next();
  } catch (error) {
    console.error('Error checking circle membership:', error);
    return res.status(500).json({
      success: false,
      data: null,
      error: 'Internal server error checking membership'
    });
  }
}
