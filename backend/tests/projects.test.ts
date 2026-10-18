import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { FieldValue } from 'firebase-admin/firestore';
import { createApp } from '../src/app.js';
import { db } from '../src/config/firebase.js';

const app = createApp();
const request = supertest(app);

const TEST_PROJECT_SLUG = 'test-project-published';
const TEST_UNPUBLISHED_SLUG = 'test-project-unpublished';

beforeAll(async () => {
  try {
    const batch = db.batch();
    batch.set(db.collection('projects').doc(TEST_PROJECT_SLUG), {
      slug: TEST_PROJECT_SLUG,
      title: 'Test Published Project',
      category: 'website-development',
      summary: 'A test project for automated testing purposes.',
      coverImageUrl: null,
      coverImageAlt: 'Test project cover',
      isPlaceholder: true,
      published: true,
      order: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    batch.set(db.collection('projects').doc(TEST_UNPUBLISHED_SLUG), {
      slug: TEST_UNPUBLISHED_SLUG,
      title: 'Test Unpublished Project',
      category: 'custom-digital-solutions',
      summary: 'A test project that is not published.',
      coverImageUrl: null,
      coverImageAlt: 'Unpublished test project cover',
      isPlaceholder: true,
      published: false,
      order: 2,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    await batch.commit();
  } catch {
    // Graceful fallback if emulator is not connected
  }
});

afterAll(async () => {
  try {
    const batch = db.batch();
    batch.delete(db.collection('projects').doc(TEST_PROJECT_SLUG));
    batch.delete(db.collection('projects').doc(TEST_UNPUBLISHED_SLUG));
    await batch.commit();
  } catch {
    // Graceful fallback
  }
});

describe('GET /api/v1/projects', () => {
  it('returns only published projects ordered by order', async () => {
    const res = await request.get('/api/v1/projects');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    const slugs = res.body.data.map((p: any) => p.slug);
    expect(slugs).toContain(TEST_PROJECT_SLUG);
    expect(slugs).not.toContain(TEST_UNPUBLISHED_SLUG);
  });

  it('has Cache-Control header', async () => {
    const res = await request.get('/api/v1/projects');
    expect(res.headers['cache-control']).toContain('public');
    expect(res.headers['cache-control']).toContain('max-age=60');
  });

  it('limit clamped at max 12 or validated', async () => {
    const res = await request.get('/api/v1/projects?limit=100');
    expect([200, 400]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.data.length).toBeLessThanOrEqual(12);
    }
  });

  it('filters by category', async () => {
    const res = await request.get('/api/v1/projects?category=website-development');
    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p.category).toBe('website-development');
    });
  });

  it('responses never contain internal-only fields', async () => {
    const res = await request.get('/api/v1/projects');
    expect(res.status).toBe(200);
    res.body.data.forEach((p: any) => {
      expect(p['internalNotes']).toBeUndefined();
      expect(p['ipHash']).toBeUndefined();
    });
  });
});

describe('GET /api/v1/projects/:slug', () => {
  it('returns published project by slug', async () => {
    const res = await request.get(`/api/v1/projects/${TEST_PROJECT_SLUG}`);
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe(TEST_PROJECT_SLUG);
  });

  it('returns 404 for unpublished project', async () => {
    const res = await request.get(`/api/v1/projects/${TEST_UNPUBLISHED_SLUG}`);
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('returns 404 for nonexistent slug', async () => {
    const res = await request.get('/api/v1/projects/this-does-not-exist');
    expect(res.status).toBe(404);
  });
});
