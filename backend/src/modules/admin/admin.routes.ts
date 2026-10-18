import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { verifyFirebaseToken, requireAdmin } from '../../middleware/auth.js';
import { updateContactSchema } from '../contact/contact.schema.js';
import { createProjectSchema, updateProjectSchema, imageUploadSchema } from '../projects/projects.schema.js';
import { adminUpsertService } from '../services/services.controller.js';
import {
  adminListContacts,
  adminGetContact,
  adminUpdateContact,
} from './adminContact.controller.js';
import {
  adminListProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetImageUploadUrl,
} from './adminProjects.controller.js';
import { adminGetDashboardMetrics } from './adminDashboard.controller.js';
import { db } from '../../config/firebase.js';
import { ok } from '../../lib/response.js';

export const adminRouter = Router();

// Everything below requires a valid token AND the admin claim.
adminRouter.use(verifyFirebaseToken, requireAdmin);

// ── Contact submissions ────────────────────────────────────────────────────────
adminRouter.get('/contact-submissions', asyncHandler(adminListContacts));
adminRouter.get('/contact-submissions/:id', asyncHandler(adminGetContact));
adminRouter.patch(
  '/contact-submissions/:id',
  validate(updateContactSchema),
  asyncHandler(adminUpdateContact),
);

// ── Projects ───────────────────────────────────────────────────────────────────
adminRouter.get('/projects', asyncHandler(adminListProjects));
adminRouter.post('/projects', validate(createProjectSchema), asyncHandler(adminCreateProject));
adminRouter.patch('/projects/:slug', validate(updateProjectSchema), asyncHandler(adminUpdateProject));
adminRouter.delete('/projects/:slug', asyncHandler(adminDeleteProject));
adminRouter.post(
  '/projects/:slug/image',
  validate(imageUploadSchema),
  asyncHandler(adminGetImageUploadUrl),
);

// ── Services ───────────────────────────────────────────────────────────────────
adminRouter.put('/services/:slug', asyncHandler(adminUpsertService));

// ── Dashboard Metrics ─────────────────────────────────────────────────────────
adminRouter.get('/dashboard-metrics', asyncHandler(adminGetDashboardMetrics));

// ── Audit logs ────────────────────────────────────────────────────────────────
adminRouter.get(
  '/audit-logs',
  asyncHandler(async (_req, res) => {
    const snap = await db
      .collection('auditLogs')
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    ok(res, snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }),
);
