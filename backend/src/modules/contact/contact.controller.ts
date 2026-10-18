import type { Request, Response } from 'express';
import { createContactSubmission } from './contact.service.js';
import { ok } from '../../lib/response.js';
import type { CreateContactInput } from './contact.schema.js';

export async function createContact(req: Request, res: Response) {
  const result = await createContactSubmission(req.body as CreateContactInput, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    requestId: req.id as string,
  });
  ok(res, { id: result.id, message: "Thank you. We'll be in touch." }, 201);
}
