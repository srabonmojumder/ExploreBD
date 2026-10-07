import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { ApiResponse } from './utils/apiResponse.js';
import { config } from './config/index.js';

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration (supports local, production domain, and Vercel previews)
  app.use(
    cors({
      origin: (requestOrigin, callback) => {
        if (!requestOrigin) return callback(null, true);
        const allowedOrigins = [
          config.clientUrl,
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'https://explorebd.vercel.app',
          'https://explore-bd-gamma.vercel.app',
          'https://explorebangladesh.vercel.app',
        ];
        if (
          allowedOrigins.includes(requestOrigin) ||
          requestOrigin.endsWith('.vercel.app')
        ) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Base API routes
  app.use('/api', apiRouter);

  // Root welcome check
  app.get('/', (_req: Request, res: Response) => {
    ApiResponse.success(res, {
      message: 'ExploreBD API Server is active.',
      version: '1.0.0',
      docs: '/api/health',
    });
  });

  // 404 Catch-all handler
  app.use((_req: Request, res: Response) => {
    ApiResponse.error(res, 'Requested API route not found', 404);
  });

  // Centralized Error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
