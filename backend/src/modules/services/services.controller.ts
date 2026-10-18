import type { Request, Response } from 'express';
import { listPublicServices, upsertService } from './services.service.js';
import { ok } from '../../lib/response.js';

export async function listServices(_req: Request, res: Response) {
  const services = await listPublicServices();
  res
    .set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    .status(200)
    .json({ success: true, data: services });
}

export async function adminUpsertService(req: Request, res: Response) {
  const slug = String(req.params['slug'] ?? '');
  const result = await upsertService(slug, req.body as any);
  ok(res, result);
}
