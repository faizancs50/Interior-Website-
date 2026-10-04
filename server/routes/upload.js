import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanBase = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^\w-]/g, '')
      .substring(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    cb(null, `${cleanBase || 'img'}-${uniqueSuffix}${ext || '.webp'}`);
  }
});

// File filter for allowed image extensions
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|avif|svg/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPG, PNG, WebP, AVIF, SVG) are permitted.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit per image
  fileFilter
});

// POST /api/upload/single (Protected by authMiddleware)
router.post('/single', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    return res.json({
      message: 'Image uploaded successfully.',
      url: publicUrl,
      filename: req.file.filename,
      size: req.file.size
    });
  } catch (err) {
    console.error('Upload error:', err);
    return res.status(500).json({ error: 'Failed to process image upload.' });
  }
});

// POST /api/upload/multiple (Protected by authMiddleware - up to 12 images)
router.post('/multiple', authMiddleware, upload.array('images', 12), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No image files uploaded.' });
    }
    const urls = req.files.map((file) => `/uploads/${file.filename}`);
    return res.json({
      message: `${req.files.length} images uploaded successfully.`,
      urls,
      files: req.files.map((f) => ({
        url: `/uploads/${f.filename}`,
        filename: f.filename,
        size: f.size
      }))
    });
  } catch (err) {
    console.error('Multiple upload error:', err);
    return res.status(500).json({ error: 'Failed to process images upload.' });
  }
});

export default router;
