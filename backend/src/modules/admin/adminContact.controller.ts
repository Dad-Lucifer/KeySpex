import type { Request, Response } from 'express';
import {
  listContactSubmissions,
  getContactSubmission,
  updateContactSubmission,
} from '../contact/contact.service.js';
import { ok } from '../../lib/response.js';
import { ApiError } from '../../lib/ApiError.js';
import type { UpdateContactInput } from '../contact/contact.schema.js';

export async function adminListContacts(req: Request, res: Response) {
  const { status, limit, cursor } = req.query as Record<string, string | undefined>;
  const submissions = await listContactSubmissions({
    status,
    limit: limit ? Number(limit) : 20,
    cursor,
  });
  ok(res, submissions);
}

export async function adminGetContact(req: Request, res: Response) {
  const id = String(req.params['id'] ?? '');
  const submission = await getContactSubmission(id);
  if (!submission) throw ApiError.notFound('Contact submission not found');
  ok(res, submission);
}

export async function adminUpdateContact(req: Request, res: Response) {
  const id = String(req.params['id'] ?? '');
  const result = await updateContactSubmission(
    id,
    req.body as UpdateContactInput,
    req.user!,
    req.id as string,
  );
  if (!result) throw ApiError.notFound('Contact submission not found');
  ok(res, result);
}
