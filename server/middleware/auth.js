import jwt from 'jsonwebtoken';
import { db } from '../db.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access denied. No authentication token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'carpenters_super_secret_jwt_key_2026_architectural_distinction';

    const decoded = jwt.verify(token, secret);
    const user = db.findUserById(decoded.id);

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden. You do not have administrator permissions.' });
    }

    // Attach user to request object (excluding passwordHash)
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      title: user.title
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};
