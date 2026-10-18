import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../config/firebase.js';

const COLLECTION = 'services';

export async function listPublicServices() {
  const snap = await db
    .collection(COLLECTION)
    .where('published', '==', true)
    .orderBy('order', 'asc')
    .get();

  return snap.docs.map((d) => ({ slug: d.id, ...d.data() }));
}

export async function upsertService(
  slug: string,
  data: { number: string; title: string; description: string; order: number; published: boolean },
) {
  await db
    .collection(COLLECTION)
    .doc(slug)
    .set({ ...data, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { slug };
}
