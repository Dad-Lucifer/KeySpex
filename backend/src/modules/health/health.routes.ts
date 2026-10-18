import { Router } from 'express';
import { db } from '../../config/firebase.js';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { ok } from '../../lib/response.js';

export const healthRouter = Router();

// Liveness – always cheap.
healthRouter.get('/', (_req, res) => ok(res, { status: 'ok', uptime: process.uptime() }));

// Readiness – verifies Firestore connectivity.
healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    await db.collection('_health').doc('ping').get();
    ok(res, { status: 'ready' });
  }),
);
