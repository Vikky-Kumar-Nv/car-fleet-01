// src/index.ts
import cluster from 'cluster';
import os from 'os';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import { apiLimiter, errorHandler } from './api/middleware';
import { apiRouter } from './api/routes';
import { config } from './config';
import { seedUsers } from './seeds/user.seed';
import fs from 'fs';

if (!fs.existsSync(config.uploadDir)) fs.mkdirSync(config.uploadDir);

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', () => cluster.fork());
} else {
  const app = express();

  app.use(helmet());
  // Broaden CORS in development to allow Vite dev server (5173) while keeping configured frontend URL
  app.use(cors({
    origin: (origin, callback) => {
      const allowed = [config.frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'];
      if (!origin || allowed.includes(origin)) return callback(null, true);
      // In production you may want to reject; for now just log and reject
      console.warn('CORS blocked origin:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(apiLimiter);

  // Serve uploaded files
  app.use('/uploads', express.static(config.uploadDir));

  mongoose.connect(config.mongoURI).then(async () => {
    console.log('Mongo connected');
    await seedUsers();
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  app.listen(config.port, () => console.log(`Worker on port ${config.port}`));
}