import fs from 'node:fs';
import path from 'node:path';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { authenticate } from './middleware/authenticate';
import { errorHandler } from './middleware/error-handler';
import { notFoundHandler } from './middleware/not-found-handler';
import { authRouter } from './modules/auth/auth.routes';
import { booksRouter } from './modules/books/books.routes';
import { healthRouter } from './modules/health/health.routes';
import { imagesRouter, uploadRouter } from './modules/images/images.routes';

const allowedOrigins = env.FRONTEND_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export function createApp() {
  const app = express();
  const frontendDistPath = path.resolve(process.cwd(), 'dist/apps/web/browser');
  const frontendIndexPath = path.join(frontendDistPath, 'index.html');
  const hasFrontendBundle = fs.existsSync(frontendIndexPath);

  app.disable('x-powered-by');
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error('Origin is not allowed by CORS.'));
      },
      credentials: true,
    })
  );
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/storage', express.static(env.STORAGE_ROOT));

  app.get('/api', (_req, res) => {
    res.json({
      name: 'book-creation-api',
      status: 'ok',
      version: '0.1.0',
    });
  });

  app.use('/api/health', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/books', authenticate, booksRouter);
  app.use('/api/images', authenticate, imagesRouter);
  app.use('/api/upload', authenticate, uploadRouter);

  if (hasFrontendBundle) {
    app.use(express.static(frontendDistPath));
    app.get(/^\/(?!api|storage).*/, (_req, res) => {
      res.sendFile(frontendIndexPath);
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
