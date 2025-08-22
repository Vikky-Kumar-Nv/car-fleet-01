// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { apiLimiter, errorHandler } from './api/middleware';
import { apiRouter } from './api/routes';
import { config } from './config';
import { seedUsers } from './seeds/user.seed';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
    if (!origin || allowed.includes(origin)) return callback(null, true);
    console.warn('CORS blocked origin:', origin);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(apiLimiter);

// Health check
app.get('/', (req, res) => res.json({ message: 'Backend API is running on Vercel!' }));

// Serve uploaded files
app.use('/uploads', express.static(config.uploadDir));

// MongoDB connection with caching for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(config.mongoURI);
    isConnected = true;
    console.log('MongoDB connected');
    await seedUsers();
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

// Connect to DB before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API routes
app.use('/api', apiRouter);

// Error handler
app.use(errorHandler);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = config.port || 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

// Export for Vercel
export default app;