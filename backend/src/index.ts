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
  app.use(cors({ origin: config.frontendUrl }));
  app.use(express.json());
  app.use(apiLimiter);

  mongoose.connect(config.mongoURI).then(async () => {
    console.log('Mongo connected');
    await seedUsers();
  });

  app.use('/api', apiRouter);

  app.use(errorHandler);

  app.listen(config.port, () => console.log(`Worker on port ${config.port}`));
}