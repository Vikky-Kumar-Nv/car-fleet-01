// src/middleware/rate.middleware.ts
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Request } from 'express';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /*, next*/) => {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});

// Login limiter: increase threshold and key by IP+email to avoid locking all users after a few attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // allow more tries during dev
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => `${ipKeyGenerator(req.ip || '')}:${(req.body?.email || '').toLowerCase()}`,
  handler: (req, res /*, next*/) => {
    res.status(429).json({ message: 'Too many login attempts. Please wait and try again.' });
  },
});