import { FieldValue } from 'firebase-admin/firestore';
import { randomUUID } from 'node:crypto';
import { db, bucket } from '../../config/firebase.js';
import { addAuditLog } from '../../lib/audit.js';
import type { AuthUser } from '../../middleware/auth.js';
import type { CreateProjectInput, UpdateProjectInput, ListProjectsQuery } from './projects.schema.js';

const COLLECTION = 'projects';

export async function listPublicProjects(query: ListProjectsQuery) {
  let q = db.collection(COLLECTION).where('published', '==', true) as FirebaseFirestore.Query;

  if (query.category) {
    q = q.where('category', '==', query.category);
  }

  q = q.orderBy('order', 'asc').limit(query.limit);
  const snap = await q.get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      slug: d.id,
      title: data['title'],
      category: data['category'],
      summary: data['summary'],
      coverImageUrl: data['coverImageUrl'] ?? null,
      coverImageAlt: data['coverImageAlt'],
      isPlaceholder: data['isPlaceholder'] ?? false,
      order: data['order'],
    };
  });
}

export async function getPublicProject(slug: string) {
  const doc = await db.collection(COLLECTION).doc(slug).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  if (!data['published']) return null;
  return { slug: doc.id, ...data };
}

export async function listAllProjects() {
  const snap = await db.collection(COLLECTION).orderBy('order', 'asc').get();
  return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}

export async function createProject(input: CreateProjectInput, actor: AuthUser, requestId?: string) {
  const ref = db.collection(COLLECTION).doc(input.slug);
  const existing = await ref.get();
  if (existing.exists) return { conflict: true as const };

  const { slug: _slug, ...fields } = input;

  const batch = db.batch();
  batch.set(ref, {
    slug: input.slug,
    ...fields,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });

  addAuditLog(db, batch, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: 'project.created',
    entity: COLLECTION,
    entityId: input.slug,
    changes: { slug: input.slug, title: input.title },
    requestId,
  });

  await batch.commit();
  return { conflict: false as const, slug: input.slug };
}

export async function updateProject(
  slug: string,
  update: UpdateProjectInput,
  actor: AuthUser,
  requestId?: string,
) {
  const ref = db.collection(COLLECTION).doc(slug);
  const doc = await ref.get();
  if (!doc.exists) return null;

  const batch = db.batch();
  batch.update(ref, { ...update, updatedAt: FieldValue.serverTimestamp() });

  addAuditLog(db, batch, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: 'project.updated',
    entity: COLLECTION,
    entityId: slug,
    changes: Object.fromEntries(Object.entries(update).map(([k, v]) => [k, v])),
    requestId,
  });

  await batch.commit();
  return { slug };
}

export async function deleteProject(slug: string, actor: AuthUser, requestId?: string) {
  const ref = db.collection(COLLECTION).doc(slug);
  const doc = await ref.get();
  if (!doc.exists) return null;

  const batch = db.batch();

  addAuditLog(db, batch, {
    actorUid: actor.uid,
    actorEmail: actor.email,
    action: 'project.deleted',
    entity: COLLECTION,
    entityId: slug,
    requestId,
  });

  batch.delete(ref);
  await batch.commit();
  return { slug };
}

export async function getSignedImageUploadUrl(
  projectSlug: string,
  contentType: string,
  fileName: string,
) {
  const ext = fileName.split('.').pop() ?? 'bin';
  const path = `public/projects/${projectSlug}/${randomUUID()}.${ext}`;
  const file = bucket().file(path);

  const [uploadUrl] = await file.getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 10 * 60 * 1000,
    contentType,
  });

  const publicUrl = `https://storage.googleapis.com/${bucket().name}/${path}`;
  return { uploadUrl, publicUrl, path };
}
