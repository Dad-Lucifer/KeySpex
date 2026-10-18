import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../config/firebase.js';
import { hashIp } from '../../lib/hash.js';
import { logger } from '../../lib/logger.js';
import { sendContactNotification } from '../../lib/mailer.js';
import type { CreateContactInput, UpdateContactInput } from './contact.schema.js';
import { addAuditLog } from '../../lib/audit.js';
import type { AuthUser } from '../../middleware/auth.js';

interface RequestMeta {
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

export async function createContactSubmission(input: CreateContactInput, meta: RequestMeta) {
  const isBot = (input.website ?? '').trim().length > 0;

  // Honeypot: pretend success, store nothing identifiable.
  if (isBot) {
    logger.warn({ requestId: meta.requestId }, 'Honeypot triggered on contact form');
    return { id: 'accepted' };
  }

  const ref = db.collection('contactSubmissions').doc();
  const { website: _honeypot, ...fields } = input;

  await ref.set({
    ...fields,
    company: fields.company || null,
    status: 'new',
    ipHash: hashIp(meta.ip),
    userAgent: meta.userAgent?.slice(0, 255) ?? null,
    internalNotes: '',
    handledBy: null,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  // Fire-and-forget: a mail failure must never fail the user's submission.
  sendContactNotification({ id: ref.id, ...fields, company: fields.company || null }).catch((err) =>
    logger.error({ err, requestId: meta.requestId }, 'Contact notification failed'),
  );

  return { id: ref.id };
}

export async function listContactSubmissions(opts: {
  status?: string;
  limit?: number;
  cursor?: string;
}) {
  let query = db.collection('contactSubmissions') as FirebaseFirestore.Query;

  if (opts.status) {
    query = query.where('status', '==', opts.status);
  }

  query = query.orderBy('createdAt', 'desc').limit(Math.min(opts.limit ?? 20, 50));

  if (opts.cursor) {
    const cursorDoc = await db.collection('contactSubmissions').doc(opts.cursor).get();
    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snap = await query.get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getContactSubmission(id: string) {
  const doc = await db.collection('contactSubmissions').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function updateContactSubmission(
  id: string,
  update: UpdateContactInput,
  actor: AuthUser,
  requestId?: string,
) {
  const ref = db.collection('contactSubmissions').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;

  const before = doc.data() ?? {};
  const changes: Record<string, unknown> = {};
  if (update.status !== undefined) changes['status'] = { before: before['status'], after: update.status };
  if (update.internalNotes !== undefined)
    changes['internalNotes'] = { before: '(redacted)', after: '(redacted)' };

  const batch = db.batch();
  batch.update(ref, {
    ...(update.status ? { status: update.status, handledBy: actor.uid } : {}),
    ...(update.internalNotes !== undefined ? { internalNotes: update.internalNotes } : {}),
    updatedAt: FieldValue.serverTimestamp(),
  });

  addAuditLog(db, batch, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: 'contact.status_changed',
    entity: 'contactSubmissions',
    entityId: id,
    changes,
    requestId,
  });

  await batch.commit();
  return { id };
}
