import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from '../../src/api/routes';
import { errorHandler } from '../../src/api/middleware/error.middleware';

export const createTestApp = () => {
  const app = express();
  
  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // Routes
  app.use('/api', apiRouter);
  
  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Test error:', err);
    const status = err.status || 500;
    res.status(status).json({ 
      message: err.message || 'Internal server error',
      error: process.env.NODE_ENV === 'test' ? err.stack : undefined
    });
  });
  
  return app;
};