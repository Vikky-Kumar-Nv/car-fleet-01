// src/middleware/rate.middleware.ts
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Request } from 'express';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit for development
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res /*, next*/) => {
    res.status(429).json({ message: 'Too many requests. Please try again later.' });
  },
});

// Login limiter: increase threshold and key by IP+email to avoid locking all users after a few attempts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 login attempts per 15 minutes per IP+email
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => `${ipKeyGenerator(req.ip || '')}:${(req.body?.email || '').toLowerCase()}`,
  handler: (req, res /*, next*/) => {
    res.status(429).json({ message: 'Too many login attempts. Please wait and try again.' });
  },
});