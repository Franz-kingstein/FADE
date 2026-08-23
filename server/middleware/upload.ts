import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

// Create uploads folder if not exists
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP images are allowed!'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Middleware to scan file headers (magic numbers) for actual file type verification
export async function validateImageHeader(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return next();
  }

  const filePath = req.file.path;
  try {
    const buffer = await fs.promises.readFile(filePath);
    if (buffer.length < 4) {
      throw new Error('File too small');
    }

    const hex = buffer.toString('hex', 0, 4).toUpperCase();
    
    // Check signatures:
    // JPEG: FFD8FF
    // PNG: 89504E47
    // WEBP: 52494646 (RIFF)
    const isJpeg = hex.startsWith('FFD8FF');
    const isPng = hex.startsWith('89504E47');
    const isWebp = hex.startsWith('52494646'); // RIFF header

    if (!isJpeg && !isPng && !isWebp) {
      // Remove invalid/malicious file
      await fs.promises.unlink(filePath);
      return res.status(400).json({
        success: false,
        data: null,
        error: 'Invalid file signature. Only real JPG, PNG, and WEBP images are allowed!'
      });
    }

    next();
  } catch (error: any) {
    console.error('Error validating file signature:', error);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error('Failed to clean up file:', err);
      }
    }
    return res.status(400).json({
      success: false,
      data: null,
      error: error.message || 'Security scan failed on uploaded image'
    });
  }
}
