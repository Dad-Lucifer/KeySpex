import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { createApp } from '../src/app.js';
import { db } from '../src/config/firebase.js';

// This test suite expects the Firebase Firestore emulator to be running on 127.0.0.1:8081
// Run: firebase emulators:start --only firestore,auth,storage
// Then: vitest run

const app = createApp();
const request = supertest(app);

const VALID_PAYLOAD = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Example Co',
  serviceInterest: 'website-development',
  message: 'We would like to discuss a new website for our business.',
  consent: true,
  source: 'landing-contact-section',
  website: '',
};

beforeAll(async () => {
  try {
    const snap = await db.collection('contactSubmissions').limit(50).get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch {
    // In environments without live emulator running, catch gracefully
  }
});

afterAll(async () => {
  try {
    const snap = await db.collection('contactSubmissions').limit(50).get();
    const batch = db.batch();
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch {
    // In environments without live emulator running, catch gracefully
  }
});

describe('POST /api/v1/contact', () => {
  it('valid payload -> 201 and stores document with status new', async () => {
    const res = await request.post('/api/v1/contact').send(VALID_PAYLOAD);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBeTruthy();
    expect(res.body.data.message).toContain("We'll be in touch");

    const id = res.body.data.id as string;
    const doc = await db.collection('contactSubmissions').doc(id).get();
    expect(doc.exists).toBe(true);
    expect(doc.data()?.status).toBe('new');
  });

  it('missing email -> 400 with field error', async () => {
    const res = await request
      .post('/api/v1/contact')
      .send({ ...VALID_PAYLOAD, email: 'not-an-email' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.details?.email).toBeTruthy();
  });

  it('consent false -> 400', async () => {
    const res = await request
      .post('/api/v1/contact')
      .send({ ...VALID_PAYLOAD, consent: false });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('message too short -> 400', async () => {
    const res = await request
      .post('/api/v1/contact')
      .send({ ...VALID_PAYLOAD, message: 'hi' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('honeypot filled -> 201 but NO document stored', async () => {
    const beforeSnap = await db.collection('contactSubmissions').count().get();
    const countBefore = beforeSnap.data().count;

    const res = await request
      .post('/api/v1/contact')
      .send({ ...VALID_PAYLOAD, website: 'http://spam.com' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);

    const afterSnap = await db.collection('contactSubmissions').count().get();
    const countAfter = afterSnap.data().count;
    expect(countAfter).toBe(countBefore);
  });

  it('stored document contains ipHash, not raw IP', async () => {
    const res = await request.post('/api/v1/contact').send(VALID_PAYLOAD);
    expect(res.status).toBe(201);

    const id = res.body.data.id as string;
    const doc = await db.collection('contactSubmissions').doc(id).get();
    const data = doc.data()!;

    expect(data['ipHash']).toBeTruthy();
    expect(data['ipHash']).toMatch(/^[a-f0-9]{64}$/);
    expect(data['ip']).toBeUndefined();
  });

  it('unknown extra fields are not persisted', async () => {
    const res = await request
      .post('/api/v1/contact')
      .send({ ...VALID_PAYLOAD, hackerField: 'injected' });
    expect(res.status).toBe(201);

    const id = res.body.data.id as string;
    const doc = await db.collection('contactSubmissions').doc(id).get();
    expect(doc.data()?.['hackerField']).toBeUndefined();
  });

  it('malformed JSON -> 400 BAD_JSON', async () => {
    const res = await request
      .post('/api/v1/contact')
      .set('Content-Type', 'application/json')
      .send('{ invalid json }');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('BAD_JSON');
  });

  it('unknown route -> 404 with standard envelope', async () => {
    const res = await request.get('/api/v1/nonexistent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
