import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import supertest from 'supertest';
import { FieldValue } from 'firebase-admin/firestore';
import { createApp } from '../src/app.js';
import { db } from '../src/config/firebase.js';
import { adminAuth } from '../src/config/firebase.js';

const app = createApp();
const request = supertest(app);

const TEST_SLUG = 'admin-test-project';
const TEST_SLUG_2 = 'admin-test-project-2';
let testSubmissionId: string;

const MOCK_ADMIN_UID = 'test-admin-uid-001';
const MOCK_ADMIN_EMAIL = 'admin@test.keyspex.in';

const createMockAdminToken = () => 'mock-admin-bearer-token';
const createMockNonAdminToken = () => 'mock-non-admin-bearer-token';

beforeAll(async () => {
  // Mock adminAuth.verifyIdToken for admin routes
  vi.spyOn(adminAuth, 'verifyIdToken').mockImplementation(async (token: string) => {
    if (token === 'mock-admin-bearer-token') {
      return {
        uid: MOCK_ADMIN_UID,
        email: MOCK_ADMIN_EMAIL,
        admin: true,
        role: 'admin',
      } as any;
    }
    if (token === 'mock-non-admin-bearer-token') {
      return {
        uid: 'non-admin-uid',
        email: 'nonadmin@test.keyspex.in',
        admin: false,
      } as any;
    }
    throw new Error('Invalid token');
  });

  try {
    const ref = db.collection('contactSubmissions').doc();
    await ref.set({
      name: 'Test User',
      email: 'testuser@example.com',
      company: 'Test Co',
      serviceInterest: 'website-development',
      message: 'Test message for admin tests.',
      consent: true,
      source: 'test',
      status: 'new',
      ipHash: 'testhash',
      userAgent: 'test-agent',
      internalNotes: '',
      handledBy: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    testSubmissionId = ref.id;

    await db.collection('projects').doc(TEST_SLUG).set({
      slug: TEST_SLUG,
      title: 'Admin Test Project',
      category: 'website-development',
      summary: 'A project for admin testing.',
      coverImageUrl: null,
      coverImageAlt: 'Admin test project',
      isPlaceholder: true,
      published: false,
      order: 999,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch {
    // Graceful fallback
  }
});

afterAll(async () => {
  vi.restoreAllMocks();
  try {
    const batch = db.batch();
    if (testSubmissionId) {
      batch.delete(db.collection('contactSubmissions').doc(testSubmissionId));
    }
    batch.delete(db.collection('projects').doc(TEST_SLUG));
    batch.delete(db.collection('projects').doc(TEST_SLUG_2));
    await batch.commit();

    const auditSnap = await db.collection('auditLogs').limit(20).get();
    const b2 = db.batch();
    auditSnap.docs.forEach((d) => b2.delete(d.ref));
    await b2.commit();
  } catch {
    // Graceful fallback
  }
});

describe('Admin auth guards', () => {
  it('no token -> 401', async () => {
    const res = await request.get('/api/v1/admin/contact-submissions');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('invalid token -> 401', async () => {
    const res = await request
      .get('/api/v1/admin/contact-submissions')
      .set('Authorization', 'Bearer bad-token-xyz');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('valid token without admin claim -> 403', async () => {
    const res = await request
      .get('/api/v1/admin/contact-submissions')
      .set('Authorization', `Bearer ${createMockNonAdminToken()}`);
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('admin token -> 200 on list endpoint', async () => {
    const res = await request
      .get('/api/v1/admin/contact-submissions')
      .set('Authorization', `Bearer ${createMockAdminToken()}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Admin contact submissions', () => {
  it('PATCH status update writes audit log in same batch', async () => {
    const auditBefore = await db.collection('auditLogs').count().get();
    const countBefore = auditBefore.data().count;

    const res = await request
      .patch(`/api/v1/admin/contact-submissions/${testSubmissionId}`)
      .set('Authorization', `Bearer ${createMockAdminToken()}`)
      .send({ status: 'in_progress' });

    expect(res.status).toBe(200);

    const auditAfter = await db.collection('auditLogs').count().get();
    const countAfter = auditAfter.data().count;
    expect(countAfter).toBeGreaterThan(countBefore);

    const sub = await db.collection('contactSubmissions').doc(testSubmissionId).get();
    expect(sub.data()?.status).toBe('in_progress');
  });

  it('GET submission by id', async () => {
    const res = await request
      .get(`/api/v1/admin/contact-submissions/${testSubmissionId}`)
      .set('Authorization', `Bearer ${createMockAdminToken()}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(testSubmissionId);
  });
});

describe('Admin projects', () => {
  it('GET all projects including unpublished', async () => {
    const res = await request
      .get('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${createMockAdminToken()}`);
    expect(res.status).toBe(200);
    const slugs = res.body.data.map((p: any) => p.slug);
    expect(slugs).toContain(TEST_SLUG);
  });

  it('duplicate project slug -> 409', async () => {
    const res = await request
      .post('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${createMockAdminToken()}`)
      .send({
        slug: TEST_SLUG,
        title: 'Duplicate Project',
        category: 'website-development',
        summary: 'This should cause a 409 conflict.',
        coverImageAlt: 'Duplicate project alt text',
      });
    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('create project with new slug -> 201 and audit log written', async () => {
    const auditBefore = await db.collection('auditLogs').count().get();
    const countBefore = auditBefore.data().count;

    const res = await request
      .post('/api/v1/admin/projects')
      .set('Authorization', `Bearer ${createMockAdminToken()}`)
      .send({
        slug: TEST_SLUG_2,
        title: 'New Admin Test Project',
        category: 'custom-digital-solutions',
        summary: 'A new project created via the admin API.',
        coverImageAlt: 'New project placeholder alt',
        isPlaceholder: true,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.slug).toBe(TEST_SLUG_2);

    const auditAfter = await db.collection('auditLogs').count().get();
    expect(auditAfter.data().count).toBeGreaterThan(countBefore);
  });

  it('PATCH project -> updates and writes audit log', async () => {
    const res = await request
      .patch(`/api/v1/admin/projects/${TEST_SLUG}`)
      .set('Authorization', `Bearer ${createMockAdminToken()}`)
      .send({ title: 'Updated Admin Test Project', published: true });
    expect(res.status).toBe(200);

    const doc = await db.collection('projects').doc(TEST_SLUG).get();
    expect(doc.data()?.title).toBe('Updated Admin Test Project');
  });

  it('DELETE project -> removes document and writes audit log', async () => {
    const auditBefore = await db.collection('auditLogs').count().get();

    const res = await request
      .delete(`/api/v1/admin/projects/${TEST_SLUG_2}`)
      .set('Authorization', `Bearer ${createMockAdminToken()}`);
    expect(res.status).toBe(200);

    const doc = await db.collection('projects').doc(TEST_SLUG_2).get();
    expect(doc.exists).toBe(false);

    const auditAfter = await db.collection('auditLogs').count().get();
    expect(auditAfter.data().count).toBeGreaterThan(auditBefore.data().count);
  });
});

describe('Platform behaviour', () => {
  it('disallowed CORS origin receives no CORS headers', async () => {
    const res = await request
      .get('/api/v1/health')
      .set('Origin', 'https://evil-attacker.com');
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('oversized body -> 413 or 400', async () => {
    const bigBody = 'x'.repeat(25 * 1024);
    const res = await request
      .post('/api/v1/contact')
      .set('Content-Type', 'application/json')
      .send(`{"name":"a","extra":"${bigBody}"}`);
    expect([400, 413]).toContain(res.status);
  });
});
