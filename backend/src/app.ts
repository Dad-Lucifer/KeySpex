import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { pinoHttp } from 'pino-http';
import { randomUUID } from 'node:crypto';

import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import { healthRouter } from './modules/health/health.routes.js';
import { contactRouter } from './modules/contact/contact.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { servicesRouter } from './modules/services/services.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export const createApp = () => {
  const app = express();

  // Required on Cloud Run / behind a proxy so req.ip is the real client IP.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    pinoHttp({
      logger,
      genReqId: (req: any) => (req.headers['x-request-id'] as string | undefined) ?? randomUUID(),
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Origin not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Firebase-AppCheck'],
      maxAge: 600,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '20kb' }));
  app.use(globalLimiter);

  const api = express.Router();
  api.use('/health', healthRouter);
  api.use('/contact', contactRouter);
  api.use('/projects', projectsRouter);
  api.use('/services', servicesRouter);
  api.use('/admin', adminRouter);
  app.use(env.API_PREFIX, api);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
