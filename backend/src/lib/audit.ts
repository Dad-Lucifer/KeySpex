import { FieldValue, type Firestore, type WriteBatch } from 'firebase-admin/firestore';

export function addAuditLog(
  db: Firestore,
  batch: WriteBatch,
  entry: {
    actorUid: string;
    actorEmail: string | null;
    action: string;
    entity: string;
    entityId: string;
    changes?: Record<string, unknown>;
    requestId?: string;
  },
) {
  batch.set(db.collection('auditLogs').doc(), {
    ...entry,
    createdAt: FieldValue.serverTimestamp(),
  });
}
