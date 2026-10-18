# KeySpex Backend — Complete Development Brief

**Stack:** Node.js · Express · TypeScript · Firebase (Firestore, Auth, Storage, Emulator Suite)
**Connects to:** the KeySpex frontend (React + Vite + TypeScript + Tailwind CSS + Shadcn UI)
**Current scope:** Landing-page backend (contact leads, portfolio content, services content, admin moderation)
**Future scope:** Admin / Employee / Client dashboards (data model sketched in Section 22, *not* built now)

> This file is the master reference for any AI coding agent or developer building the KeySpex backend. Read it fully before writing code. Follow the build sequence in Section 3 and the verification rules in Section 23.

---

## Table of Contents

1. [Purpose and scope](#1-purpose-and-scope)
2. [Architecture overview](#2-architecture-overview)
3. [Build sequence for the agent](#3-build-sequence-for-the-agent)
4. [Technology choices](#4-technology-choices)
5. [Repository structure](#5-repository-structure)
6. [Firebase project setup](#6-firebase-project-setup)
7. [Environment variables](#7-environment-variables)
8. [Dependencies, scripts, and TypeScript config](#8-dependencies-scripts-and-typescript-config)
9. [Core backend code](#9-core-backend-code)
10. [Firestore data model](#10-firestore-data-model)
11. [API specification](#11-api-specification)
12. [Validation schemas](#12-validation-schemas)
13. [Contact flow implementation](#13-contact-flow-implementation)
14. [Authentication and authorization](#14-authentication-and-authorization)
15. [Security hardening](#15-security-hardening)
16. [Email notifications](#16-email-notifications)
17. [File storage for project images](#17-file-storage-for-project-images)
18. [Frontend integration](#18-frontend-integration)
19. [Seeding and local development](#19-seeding-and-local-development)
20. [Testing](#20-testing)
21. [Deployment](#21-deployment)
22. [Phase 2: dashboards data model](#22-phase-2-dashboards-data-model)
23. [Final verification checklist](#23-final-verification-checklist)
24. [Master instruction for AI coding agents](#24-master-instruction-for-ai-coding-agents)

---

## 1. Purpose and scope

### 1.1 What the backend must do (Phase 1)

The KeySpex landing page is mostly static, but a premium business website needs a real backend for four things:

| # | Capability | Why it matters |
|---|------------|----------------|
| 1 | **Receive contact / "Let's Talk" enquiries** | The primary conversion goal of the site. |
| 2 | **Serve portfolio ("Selected Work") content** | Lets KeySpex add or edit projects without redeploying the frontend. |
| 3 | **Serve services content** (optional, with frontend fallback) | Keeps the three service descriptions editable. |
| 4 | **Provide a protected admin API** | Lets authorised KeySpex staff review enquiries and manage projects. |

### 1.2 What the backend must NOT do

These rules mirror the frontend brief and are non-negotiable:

- **Do not fabricate** client names, testimonials, statistics, certifications, awards, contact details, or business results. Any seed or sample data must be clearly flagged as a placeholder (`isPlaceholder: true`).
- **Do not store more personal data than necessary.** The contact form collects only what is needed to reply.
- **Do not build dashboard features yet.** Section 22 only reserves a compatible foundation.
- **Do not add unnecessary libraries.** Every dependency listed in Section 8 has a purpose.

### 1.3 Design principles

- **Backend-only database access.** The browser never talks to Firestore directly. All reads and writes go through the Node.js API using the Firebase Admin SDK. Firestore security rules therefore deny all client access.
- **Thin controllers, focused services.** Routes → controllers → services → Firestore. No business logic inside route files.
- **Validate everything at the edge** with Zod. Never trust request bodies, params, or query strings.
- **Consistent response envelope** for success and errors (Section 11.1).
- **Frontend resilience.** If the API is unreachable, the landing page must still render using static content. Only the contact form depends on the backend being up.

---

## 2. Architecture overview

```
┌──────────────────────────┐        HTTPS (JSON)        ┌─────────────────────────────┐
│  Frontend (React + Vite) │ ─────────────────────────▶ │  Node.js + Express API      │
│  Firebase Hosting / any  │ ◀───────────────────────── │  (Cloud Run or any Node host)│
└──────────────────────────┘                            └──────────────┬──────────────┘
                                                                       │ Firebase Admin SDK
                                      ┌────────────────────────────────┼───────────────────────────┐
                                      ▼                                ▼                           ▼
                              ┌───────────────┐               ┌─────────────────┐         ┌─────────────────┐
                              │  Firestore    │               │ Firebase Auth   │         │ Cloud Storage   │
                              │ (data)        │               │ (admin identity)│         │ (project images)│
                              └───────────────┘               └─────────────────┘         └─────────────────┘
```

### Request lifecycle

1. Browser sends a request to `/api/v1/...`.
2. Express middleware chain runs: request ID → logging → security headers → CORS → body parser → rate limiter.
3. Route-level middleware runs: Zod validation → (admin routes only) Firebase ID-token verification and role check.
4. Controller calls a service; the service talks to Firestore / Storage / email.
5. Response is returned in the standard envelope. Errors flow through a single error handler.

### Public vs admin surface

| Surface | Prefix | Auth | Consumers |
|---------|--------|------|-----------|
| Public | `/api/v1/*` | None (rate-limited) | Landing page |
| Admin | `/api/v1/admin/*` | Firebase ID token + `admin` claim | Future admin UI / scripts |

---

## 3. Build sequence for the agent

Follow this order. Do not skip steps, and do not claim a step is complete without running its check.

1. **Inspect the repository.** Locate the `frontend/` folder, its `package.json`, and its `.env*` files. Preserve working frontend configuration.
2. **Create the `backend/` folder** next to `frontend/` (Section 5).
3. **Initialise the Node + TypeScript project** (Section 8).
4. **Add configuration and Firebase initialisation** (Sections 7 and 9.1–9.2).
5. **Build the Express app shell**: middleware, health route, error handler (Section 9.3–9.6).
6. **Create validation schemas** (Section 12).
7. **Build modules one at a time**, each with route + controller + service + tests:
   1. `health`
   2. `contact`
   3. `projects` (public read)
   4. `services` (public read)
   5. `admin` (auth middleware, enquiry management, project CRUD)
8. **Add Firestore rules, indexes, and Storage rules** (Sections 10.6, 15.5, 17).
9. **Write the seed script** (Section 19.3).
10. **Set up the Firebase Emulator Suite** and verify everything locally (Section 19.2).
11. **Wire the frontend** (Section 18): API client, contact form, optional project/service fetching with fallbacks.
12. **Write tests** (Section 20).
13. **Run lint, type-check, tests, and build** for both `backend/` and `frontend/`.
14. **Document** any deviations in the README.

---

## 4. Technology choices

| Technology | Purpose | Notes |
|------------|---------|-------|
| **Node.js 20 LTS** | Runtime | Use the latest active LTS (20 or newer). |
| **Express 4** | HTTP framework | Mature and simple; no need for heavier frameworks. |
| **TypeScript** | Type safety | `strict: true`. |
| **Firebase Admin SDK** | Firestore, Auth, Storage access | Server-side only. |
| **Firestore** | Primary database | Document model fits leads, projects, and content. |
| **Firebase Auth** | Admin identity | Admins sign in via Firebase; the API verifies ID tokens and custom claims. |
| **Cloud Storage for Firebase** | Project images | Public-read project assets only. |
| **Zod** | Runtime validation + inferred types | Single source of truth for request shapes. |
| **Helmet** | Security headers | |
| **cors** | Origin allow-listing | |
| **express-rate-limit** | Abuse protection | |
| **pino + pino-http** | Structured logging | JSON logs work well with Cloud Logging. |
| **Nodemailer** *(optional)* | Email notification of new enquiries | Can be swapped for a Firebase extension (Section 16). |
| **Vitest + Supertest** | Testing | |
| **tsx** | Dev runner | Fast TypeScript execution with watch mode. |

> **Dependency policy:** do not add ORMs, GraphQL layers, or auth libraries on top of this. Firebase already covers those needs.

---

## 5. Repository structure

Use a simple monorepo-style layout with two sibling folders. If the project already has a different layout, adapt but keep the backend self-contained.

```
keyspex/
├── frontend/                         # Existing React + Vite app
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api.ts                # NEW – API client (Section 18)
│   │   │   └── types.ts              # NEW – shared response types
│   │   └── components/landing/
│   │       ├── ContactSection.tsx
│   │       └── ContactForm.tsx       # NEW – form logic (Section 18.4)
│   ├── .env.example
│   └── vite.config.ts
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.ts                # Zod-validated environment
│   │   │   └── firebase.ts           # Admin SDK initialisation
│   │   ├── middleware/
│   │   │   ├── requestId.ts
│   │   │   ├── auth.ts               # verifyFirebaseToken, requireAdmin
│   │   │   ├── validate.ts           # Zod validation wrapper
│   │   │   ├── rateLimiters.ts
│   │   │   ├── notFound.ts
│   │   │   └── errorHandler.ts
│   │   ├── modules/
│   │   │   ├── health/
│   │   │   │   └── health.routes.ts
│   │   │   ├── contact/
│   │   │   │   ├── contact.routes.ts
│   │   │   │   ├── contact.controller.ts
│   │   │   │   ├── contact.service.ts
│   │   │   │   └── contact.schema.ts
│   │   │   ├── projects/
│   │   │   │   ├── projects.routes.ts
│   │   │   │   ├── projects.controller.ts
│   │   │   │   ├── projects.service.ts
│   │   │   │   └── projects.schema.ts
│   │   │   ├── services/
│   │   │   │   ├── services.routes.ts
│   │   │   │   ├── services.controller.ts
│   │   │   │   └── services.service.ts
│   │   │   └── admin/
│   │   │       ├── admin.routes.ts
│   │   │       ├── adminContact.controller.ts
│   │   │       └── adminProjects.controller.ts
│   │   ├── lib/
│   │   │   ├── ApiError.ts
│   │   │   ├── asyncHandler.ts
│   │   │   ├── logger.ts
│   │   │   ├── hash.ts               # IP hashing
│   │   │   ├── mailer.ts             # Optional email
│   │   │   └── response.ts           # Envelope helpers
│   │   ├── types/
│   │   │   └── express.d.ts          # req.user, req.id typing
│   │   ├── app.ts                    # Builds the Express app (no listen)
│   │   └── server.ts                 # Starts the server
│   ├── scripts/
│   │   ├── seed.ts
│   │   └── setAdminClaim.ts
│   ├── tests/
│   │   ├── contact.test.ts
│   │   ├── projects.test.ts
│   │   └── admin.test.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── firebase.json                     # Emulators, hosting rewrites, rules paths
├── .firebaserc
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
└── README.md
```

**Key rule:** `app.ts` exports the configured Express app without calling `listen`. `server.ts` imports it and listens. This makes testing with Supertest trivial.

---

## 6. Firebase project setup

Perform these steps in the [Firebase Console](https://console.firebase.google.com) and CLI. Document the chosen project ID in `.firebaserc`.

### 6.1 Create the project

1. Create a Firebase project named **KeySpex** (the project ID will be generated; do not invent one).
2. Upgrade to the **Blaze** plan only if you need Cloud Run, outbound network calls from Cloud Functions, or production-scale Storage. Local development with emulators is free.

### 6.2 Enable services

| Service | Setup |
|---------|-------|
| **Firestore** | Create database in **production mode**. Choose the location carefully; it cannot be changed later. For an India-based business a nearby region such as `asia-south1` (Mumbai) is a sensible choice — confirm with the owner. |
| **Authentication** | Enable **Email/Password**. Create at least one admin user manually. Disable open sign-ups for the public if no public accounts are needed. |
| **Storage** | Enable the default bucket in the same region as Firestore. |
| **App Check** *(recommended)* | Register the frontend with reCAPTCHA Enterprise or reCAPTCHA v3 (see Section 15.4). |

### 6.3 Service account credentials

For local development **without** emulators, or for scripts:

1. Project settings → Service accounts → **Generate new private key**.
2. Save as `backend/serviceAccountKey.json`.
3. **Add it to `.gitignore` immediately.** Never commit it.

In production on Cloud Run, do **not** ship a key file. Use the attached runtime service account with Application Default Credentials.

### 6.4 CLI

```bash
npm install -g firebase-tools
firebase login
firebase init   # Select: Firestore, Storage, Emulators (and Hosting if deploying the frontend there)
```

---

## 7. Environment variables

### 7.1 `backend/.env.example`

```bash
# ── Server ───────────────────────────────────────────────
NODE_ENV=development
PORT=8080
API_PREFIX=/api/v1
LOG_LEVEL=info

# ── CORS (comma-separated list of allowed origins) ──────
# Add your real production domain once it exists.
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# ── Firebase ─────────────────────────────────────────────
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_STORAGE_BUCKET=your-firebase-project-id.appspot.com

# Local only. In production use Application Default Credentials.
# GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json

# Emulator hosts (set automatically by `firebase emulators:exec`; set manually for `npm run dev`)
# FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
# FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
# FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199

# ── Privacy ──────────────────────────────────────────────
# Long random string used to hash IP addresses before storing them.
IP_HASH_SALT=replace-with-a-long-random-secret

# ── Rate limiting ────────────────────────────────────────
CONTACT_RATE_LIMIT_MAX=5
CONTACT_RATE_LIMIT_WINDOW_MINUTES=60
GLOBAL_RATE_LIMIT_MAX=300
GLOBAL_RATE_LIMIT_WINDOW_MINUTES=15

# ── Email notifications (optional; leave blank to disable) ─
MAIL_ENABLED=false
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=
MAIL_NOTIFY_TO=
```

> Do not invent real email addresses or SMTP credentials. Leave them blank until KeySpex provides genuine ones.

> **Port note:** the Firestore emulator and the API both default to 8080 in the examples above. Run the emulator on a different port (Section 19.2 uses `8081`) or set `PORT=4000` for the API. The `firebase.json` in this document uses 8081 for Firestore.

### 7.2 `frontend/.env.example`

```bash
# Base URL of the KeySpex API.
# In development, leave unset to use the Vite proxy (/api → http://localhost:4000).
VITE_API_BASE_URL=
```

### 7.3 `.gitignore` additions

```
backend/.env
backend/serviceAccountKey.json
backend/dist/
frontend/.env
.firebase/
firebase-debug.log
*.log
```

---

## 8. Dependencies, scripts, and TypeScript config

### 8.1 Install

```bash
cd backend
npm init -y
npm install express firebase-admin zod helmet cors compression express-rate-limit pino pino-http dotenv
npm install nodemailer                      # optional (email)
npm install -D typescript tsx vitest supertest \
  @types/node @types/express @types/cors @types/compression @types/supertest @types/nodemailer \
  eslint prettier pino-pretty
```

### 8.2 `package.json` (relevant parts)

```json
{
  "name": "keyspex-backend",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest",
    "seed": "tsx scripts/seed.ts",
    "admin:grant": "tsx scripts/setAdminClaim.ts"
  }
}
```

### 8.3 `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts", "scripts/**/*.ts"]
}
```

> With `module: NodeNext`, relative imports in source must include the `.js` extension (e.g. `import { env } from './config/env.js'`). Keep this consistent everywhere.
> Because `rootDir` is `.`, the compiled entry point is `dist/src/server.js`. Set the `start` script to `node dist/src/server.js` (or change `rootDir` to `src` and exclude `scripts/` from the build). Pick one and keep it consistent in the Dockerfile.

---

## 9. Core backend code

These are reference implementations. Adapt as needed, but keep the structure and behaviour.

### 9.1 `src/config/env.ts`

```ts
import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  LOG_LEVEL: z.string().default('info'),

  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),

  IP_HASH_SALT: z.string().min(16),

  CONTACT_RATE_LIMIT_MAX: z.coerce.number().default(5),
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(60),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().default(300),
  GLOBAL_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),

  MAIL_ENABLED: z.enum(['true', 'false']).default('false'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_NOTIFY_TO: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  mailEnabled: parsed.data.MAIL_ENABLED === 'true',
  isProd: parsed.data.NODE_ENV === 'production',
};
```

### 9.2 `src/config/firebase.ts`

```ts
import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { env } from './env.js';

const app =
  getApps()[0] ??
  initializeApp({
    credential: applicationDefault(), // Uses GOOGLE_APPLICATION_CREDENTIALS locally, runtime SA on Cloud Run
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
  });

export const db = getFirestore(app);
db.settings({ ignoreUndefinedProperties: true });

export const adminAuth = getAuth(app);
export const bucket = () => getStorage(app).bucket();
```

> When emulator host variables are present, the Admin SDK automatically routes to the emulators. No code change is needed.

### 9.3 Utilities

`src/lib/ApiError.ts`

```ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }

  static badRequest(message = 'Invalid request', details?: unknown) {
    return new ApiError(400, 'BAD_REQUEST', message, details);
  }
  static unauthorized(message = 'Authentication required') {
    return new ApiError(401, 'UNAUTHORIZED', message);
  }
  static forbidden(message = 'You do not have access to this resource') {
    return new ApiError(403, 'FORBIDDEN', message);
  }
  static notFound(message = 'Resource not found') {
    return new ApiError(404, 'NOT_FOUND', message);
  }
  static conflict(message = 'Conflict') {
    return new ApiError(409, 'CONFLICT', message);
  }
}
```

`src/lib/asyncHandler.ts`

```ts
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res, next).catch(next);
  };
```

`src/lib/response.ts`

```ts
import type { Response } from 'express';

export const ok = <T>(res: Response, data: T, status = 200) =>
  res.status(status).json({ success: true, data });
```

`src/lib/hash.ts`

```ts
import { createHash } from 'node:crypto';
import { env } from '../config/env.js';

export const hashIp = (ip: string | undefined) =>
  ip ? createHash('sha256').update(`${env.IP_HASH_SALT}:${ip}`).digest('hex') : null;
```

`src/lib/logger.ts`

```ts
import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.LOG_LEVEL,
  redact: ['req.headers.authorization', 'req.headers.cookie'],
  ...(env.isProd ? {} : { transport: { target: 'pino-pretty' } }),
});
```

### 9.4 Middleware

`src/middleware/validate.ts`

```ts
import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { ApiError } from '../lib/ApiError.js';

type Target = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodTypeAny, target: Target = 'body'): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', result.error.flatten().fieldErrors));
    }
    // Replace with the parsed (trimmed, typed, stripped) data.
    Object.defineProperty(req, target, { value: result.data, writable: true, configurable: true });
    next();
  };
```

`src/middleware/rateLimiters.ts`

```ts
import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

const handler = (_req: unknown, res: any) =>
  res.status(429).json({
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again later.' },
  });

export const globalLimiter = rateLimit({
  windowMs: env.GLOBAL_RATE_LIMIT_WINDOW_MINUTES * 60_000,
  limit: env.GLOBAL_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler,
});

export const contactLimiter = rateLimit({
  windowMs: env.CONTACT_RATE_LIMIT_WINDOW_MINUTES * 60_000,
  limit: env.CONTACT_RATE_LIMIT_MAX,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler,
});
```

`src/middleware/errorHandler.ts` and `notFound.ts`

```ts
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../lib/ApiError.js';
import { logger } from '../lib/logger.js';

export const notFound: RequestHandler = (_req, _res, next) => next(ApiError.notFound('Route not found'));

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // Malformed JSON from body-parser
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_JSON', message: 'Request body is not valid JSON' },
    });
  }

  logger.error({ err, requestId: req.id }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' },
  });
};
```

> Never leak stack traces or raw Firebase error messages to clients.

### 9.5 `src/app.ts`

```ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';

import { env } from './config/env.js';
import { logger } from './lib/logger.js';
import { globalLimiter } from './middleware/rateLimiters.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

import { healthRouter } from './modules/health/health.routes.js';
import { contactRouter } from './modules/contact/contact.routes.js';
import { projectsRouter } from './modules/projects/projects.routes.js';
import { servicesRouter } from './modules/services/services.routes.js';
import { adminRouter } from './modules/admin/admin.routes.js';

export const createApp = () => {
  const app = express();

  // Required on Cloud Run / behind a proxy so req.ip is the real client IP.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(
    pinoHttp({
      logger,
      genReqId: (req) => (req.headers['x-request-id'] as string) ?? randomUUID(),
    }),
  );
  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / server-to-server (no Origin header) and allow-listed origins.
        if (!origin || env.corsOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Origin not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Firebase-AppCheck'],
      maxAge: 600,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '20kb' })); // Contact payloads are tiny; keep the limit tight.
  app.use(globalLimiter);

  const api = express.Router();
  api.use('/health', healthRouter);
  api.use('/contact', contactRouter);
  api.use('/projects', projectsRouter);
  api.use('/services', servicesRouter);
  api.use('/admin', adminRouter);
  app.use(env.API_PREFIX, api);

  app.use(notFound);
  app.use(errorHandler);
  return app;
};
```

### 9.6 `src/server.ts`

```ts
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './lib/logger.js';

const server = createApp().listen(env.PORT, () => {
  logger.info(`KeySpex API listening on :${env.PORT}${env.API_PREFIX}`);
});

const shutdown = (signal: string) => {
  logger.info(`${signal} received, shutting down`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

### 9.7 Health route

```ts
// src/modules/health/health.routes.ts
import { Router } from 'express';
import { db } from '../../config/firebase.js';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { ok } from '../../lib/response.js';

export const healthRouter = Router();

// Liveness – always cheap.
healthRouter.get('/', (_req, res) => ok(res, { status: 'ok', uptime: process.uptime() }));

// Readiness – verifies Firestore connectivity.
healthRouter.get(
  '/ready',
  asyncHandler(async (_req, res) => {
    await db.collection('_health').doc('ping').get();
    ok(res, { status: 'ready' });
  }),
);
```

---

## 10. Firestore data model

Firestore is schemaless, so the schema below is enforced by **Zod in the API**, not by the database.

### 10.1 Conventions

- Collection names: `camelCase`, plural.
- Timestamps: Firestore `Timestamp` in the database (`FieldValue.serverTimestamp()` on write), converted to **ISO 8601 strings** in API responses.
- IDs: auto-generated by Firestore, except `projects` and `services` which use a **slug** as the document ID for stable URLs.
- Soft state over deletion where history matters (enquiries use `status`; projects use `published`).
- Never store secrets in Firestore.

### 10.2 `contactSubmissions`

Stores every valid enquiry from the "Let's Talk" / "Start a Conversation" form.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✔ | 2–100 chars, trimmed |
| `email` | string | ✔ | Valid email, lower-cased |
| `company` | string | – | ≤ 120 chars |
| `serviceInterest` | enum | ✔ | `website-development` \| `custom-digital-solutions` \| `digital-growth-optimization` \| `other` |
| `message` | string | ✔ | 10–3000 chars |
| `consent` | boolean | ✔ | Must be `true` (agreement to be contacted about the enquiry) |
| `status` | enum | ✔ | `new` \| `in_progress` \| `replied` \| `archived` \| `spam` — default `new` |
| `source` | string | ✔ | e.g. `landing-contact-section`, `landing-navbar-cta` |
| `ipHash` | string \| null | ✔ | SHA-256 of salted IP (never the raw IP) |
| `userAgent` | string \| null | – | Truncated to 255 chars |
| `internalNotes` | string | – | Admin-only, ≤ 2000 chars |
| `createdAt` | Timestamp | ✔ | Server timestamp |
| `updatedAt` | Timestamp | ✔ | Server timestamp |
| `handledBy` | string \| null | – | Admin UID who last changed the status |

### 10.3 `projects`

Powers the "Selected Work" section. Document ID = slug (e.g. `placeholder-project-one`).

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | ✔ | ≤ 120 chars |
| `slug` | string | ✔ | Matches doc ID; `^[a-z0-9]+(?:-[a-z0-9]+)*$` |
| `category` | enum | ✔ | Same values as `serviceInterest` (except `other`) |
| `summary` | string | ✔ | One sentence, ≤ 220 chars |
| `description` | string | – | Longer text for a future detail page |
| `coverImageUrl` | string \| null | ✔ | HTTPS URL (Firebase Storage public URL) or `null` for placeholder art |
| `coverImageAlt` | string | ✔ | Descriptive alt text (accessibility requirement) |
| `gallery` | array of `{ url, alt }` | – | Optional additional images |
| `projectUrl` | string \| null | – | Public link, only if the client permits it |
| `isPlaceholder` | boolean | ✔ | **`true` for any sample content**; the frontend renders a "Sample project" label |
| `published` | boolean | ✔ | Only `true` records are returned publicly |
| `order` | number | ✔ | Ascending display order |
| `createdAt`, `updatedAt` | Timestamp | ✔ | |

> **Honesty rule:** never describe a placeholder as real client work. Never invent a client name, result, or metric. Real projects must be added only with genuine information supplied by KeySpex.

### 10.4 `services`

Optional dynamic copy for the three service offerings. Document ID = slug.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `number` | string | ✔ | `"01"`, `"02"`, `"03"` |
| `title` | string | ✔ | |
| `description` | string | ✔ | |
| `order` | number | ✔ | |
| `published` | boolean | ✔ | |
| `updatedAt` | Timestamp | ✔ | |

Approved seed content (from the brand brief):

| # | Title | Description |
|---|-------|-------------|
| 01 | Website Development | Responsive, carefully crafted websites designed to communicate a business's value, establish trust, and convert visitors into customers. |
| 02 | Custom Digital Solutions | Purpose-built digital products and business tools designed around customer needs and business workflows. |
| 03 | Digital Growth & Optimization | Practical improvements to digital presence, usability, and customer experience. |

### 10.5 `siteSettings` *(optional, single document `public`)*

Small editable values for the site (never contact details unless supplied by KeySpex).

| Field | Type | Notes |
|-------|------|-------|
| `contactEmail` | string \| null | **Leave `null` until KeySpex provides a real address** |
| `socialLinks` | array of `{ label, url }` | Empty until real accounts exist |
| `updatedAt` | Timestamp | |

### 10.6 `auditLogs`

Records admin actions on enquiries and projects. **Append-only** — the API never updates or deletes these.

| Field | Type | Notes |
|-------|------|-------|
| `actorUid` | string | Firebase UID |
| `actorEmail` | string \| null | |
| `action` | string | e.g. `contact.status_changed`, `project.created`, `project.updated`, `project.deleted` |
| `entity` | string | Collection name |
| `entityId` | string | |
| `changes` | map | Before/after for changed fields only (never include secrets) |
| `requestId` | string | For log correlation |
| `createdAt` | Timestamp | |

### 10.7 `firestore.rules`

All data access goes through the Admin SDK, which bypasses rules. The rules therefore **deny every client read and write** as a safety net.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 10.8 `firestore.indexes.json`

Required for the public list queries (`published == true` ordered by `order`) and the admin list queries.

```json
{
  "indexes": [
    {
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "published", "order": "ASCENDING" },
        { "fieldPath": "order", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "services",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "published", "order": "ASCENDING" },
        { "fieldPath": "order", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "contactSubmissions",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

---

## 11. API specification

Base URL (dev): `http://localhost:4000/api/v1`

### 11.1 Response envelope

**Success**

```json
{ "success": true, "data": { } }
```

**Error**

```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": { "email": ["Enter a valid email address"] }
  }
}
```

| HTTP | `code` | Meaning |
|------|--------|---------|
| 400 | `BAD_REQUEST`, `BAD_JSON` | Validation or parse failure |
| 401 | `UNAUTHORIZED` | Missing / invalid token |
| 403 | `FORBIDDEN` | Authenticated but not an admin |
| 404 | `NOT_FOUND` | Unknown route or resource |
| 409 | `CONFLICT` | e.g. duplicate project slug |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Unexpected failure (details only in server logs) |

### 11.2 Public endpoints

#### `GET /health`
Liveness check. → `200 { status: "ok", uptime }`

#### `GET /health/ready`
Readiness check (touches Firestore). → `200 { status: "ready" }` or `500`.

#### `POST /contact`
Submit an enquiry. **Rate-limited** (default 5 per hour per IP).

Request body:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "company": "Example Co.",
  "serviceInterest": "website-development",
  "message": "We would like to discuss a new website for our business.",
  "consent": true,
  "source": "landing-contact-section",
  "website": ""
}
```

> `website` is a **honeypot** field. It must be empty. Real users never see it (hidden via CSS and `aria-hidden`). Bots fill it in.

Responses:

| Status | Body |
|--------|------|
| `201` | `{ "success": true, "data": { "id": "<docId>", "message": "Thank you. We'll be in touch." } }` |
| `400` | Validation errors by field |
| `429` | Rate-limited |

> If the honeypot is filled, return the same **`201`** response but **do not store** the submission (or store it with `status: "spam"`). This avoids teaching bots that they were detected.

#### `GET /projects`
Published projects ordered by `order`.

Optional query: `?category=website-development&limit=6` (`limit` max 12).

```json
{
  "success": true,
  "data": [
    {
      "slug": "placeholder-project-one",
      "title": "Sample Project One",
      "category": "website-development",
      "summary": "A placeholder entry to be replaced with real work.",
      "coverImageUrl": null,
      "coverImageAlt": "Placeholder artwork for a sample project",
      "isPlaceholder": true,
      "order": 1
    }
  ]
}
```

Add `Cache-Control: public, max-age=60, stale-while-revalidate=300` to this response.

#### `GET /projects/:slug`
Single published project (including `description` and `gallery`). `404` if missing or unpublished.

#### `GET /services`
Published services ordered by `order`. Same caching header as projects.

#### `GET /site-settings` *(optional)*
Returns the public `siteSettings/public` document.

### 11.3 Admin endpoints

All require `Authorization: Bearer <Firebase ID token>` and the `admin: true` custom claim.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/admin/contact-submissions` | List enquiries. Query: `status`, `limit` (≤ 50), `cursor` (last doc ID) |
| `GET` | `/admin/contact-submissions/:id` | Enquiry detail |
| `PATCH` | `/admin/contact-submissions/:id` | Update `status` and/or `internalNotes` |
| `GET` | `/admin/projects` | List all projects (including unpublished) |
| `POST` | `/admin/projects` | Create project (slug becomes doc ID; `409` if exists) |
| `PATCH` | `/admin/projects/:slug` | Update project fields |
| `DELETE` | `/admin/projects/:slug` | Delete project (writes an audit log first) |
| `POST` | `/admin/projects/:slug/image` | Request a signed upload URL for a cover/gallery image (Section 17) |
| `PUT` | `/admin/services/:slug` | Create or update a service |
| `GET` | `/admin/audit-logs` | List recent audit logs (read-only) |

> Pagination uses **cursor-based paging** (`startAfter`) rather than offset paging, which is both cheaper and more reliable in Firestore.

---

## 12. Validation schemas

### 12.1 `contact.schema.ts`

```ts
import { z } from 'zod';

export const SERVICE_INTEREST = [
  'website-development',
  'custom-digital-solutions',
  'digital-growth-optimization',
  'other',
] as const;

const clean = (max: number, min = 0) =>
  z.string().trim().min(min).max(max);

export const createContactSchema = z.object({
  name: clean(100, 2),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
  company: clean(120).optional().or(z.literal('')),
  serviceInterest: z.enum(SERVICE_INTEREST),
  message: clean(3000, 10),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  source: clean(60).default('landing-contact-section'),
  website: z.string().max(200).optional().default(''), // honeypot
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

export const updateContactSchema = z
  .object({
    status: z.enum(['new', 'in_progress', 'replied', 'archived', 'spam']).optional(),
    internalNotes: clean(2000).optional(),
  })
  .refine((v) => v.status !== undefined || v.internalNotes !== undefined, {
    message: 'Provide at least one field to update',
  });
```

### 12.2 `projects.schema.ts`

```ts
import { z } from 'zod';

const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens').max(80);

export const projectCategory = z.enum([
  'website-development',
  'custom-digital-solutions',
  'digital-growth-optimization',
]);

const httpsUrl = z.string().url().refine((u) => u.startsWith('https://'), 'URL must use HTTPS');

export const createProjectSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(120),
  category: projectCategory,
  summary: z.string().trim().min(10).max(220),
  description: z.string().trim().max(5000).optional(),
  coverImageUrl: httpsUrl.nullable().default(null),
  coverImageAlt: z.string().trim().min(5).max(200),
  gallery: z.array(z.object({ url: httpsUrl, alt: z.string().trim().min(5).max(200) })).max(12).default([]),
  projectUrl: httpsUrl.nullable().default(null),
  isPlaceholder: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().min(0).max(1000).default(100),
});

export const updateProjectSchema = createProjectSchema.omit({ slug: true }).partial();

export const listProjectsQuery = z.object({
  category: projectCategory.optional(),
  limit: z.coerce.number().int().min(1).max(12).default(6),
});
```

---

## 13. Contact flow implementation

### 13.1 Service

```ts
// src/modules/contact/contact.service.ts
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../../config/firebase.js';
import { hashIp } from '../../lib/hash.js';
import { logger } from '../../lib/logger.js';
import { sendContactNotification } from '../../lib/mailer.js';
import type { CreateContactInput } from './contact.schema.js';

interface RequestMeta {
  ip?: string;
  userAgent?: string;
  requestId?: string;
}

export async function createContactSubmission(input: CreateContactInput, meta: RequestMeta) {
  const isBot = input.website.trim().length > 0;

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
  sendContactNotification({ id: ref.id, ...fields }).catch((err) =>
    logger.error({ err, requestId: meta.requestId }, 'Contact notification failed'),
  );

  return { id: ref.id };
}
```

### 13.2 Controller and routes

```ts
// src/modules/contact/contact.controller.ts
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
```

```ts
// src/modules/contact/contact.routes.ts
import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { contactLimiter } from '../../middleware/rateLimiters.js';
import { createContactSchema } from './contact.schema.js';
import { createContact } from './contact.controller.js';

export const contactRouter = Router();
contactRouter.post('/', contactLimiter, validate(createContactSchema), asyncHandler(createContact));
```

### 13.3 Behavioural requirements

- Trim and validate every field with Zod before touching Firestore.
- Store only a **salted hash** of the IP, never the raw address.
- A failed email notification **must not** cause a failed API response; the enquiry is already safely stored.
- Never echo submitted content back in error messages or logs beyond field-level validation messages.
- Logs must not contain the message body or email address.

---

## 14. Authentication and authorization

### 14.1 Model

- Admins are regular **Firebase Auth** users with a **custom claim** `admin: true`.
- The API verifies the Firebase **ID token** on every admin request with `adminAuth.verifyIdToken(token, true)` (the `true` checks for revoked tokens).
- There are no public user accounts in Phase 1.

### 14.2 Middleware

```ts
// src/middleware/auth.ts
import type { RequestHandler } from 'express';
import { adminAuth } from '../config/firebase.js';
import { ApiError } from '../lib/ApiError.js';

export interface AuthUser {
  uid: string;
  email: string | null;
  role: string | null;
  isAdmin: boolean;
}

export const verifyFirebaseToken: RequestHandler = async (req, _res, next) => {
  try {
    const header = req.get('authorization') ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) throw ApiError.unauthorized();

    const decoded = await adminAuth.verifyIdToken(token, true);
    req.user = {
      uid: decoded.uid,
      email: decoded.email ?? null,
      role: (decoded.role as string | undefined) ?? null,
      isAdmin: decoded.admin === true,
    } satisfies AuthUser;
    next();
  } catch (err) {
    next(err instanceof ApiError ? err : ApiError.unauthorized('Invalid or expired token'));
  }
};

export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.user?.isAdmin) return next(ApiError.forbidden());
  next();
};
```

```ts
// src/types/express.d.ts
import type { AuthUser } from '../middleware/auth.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      id?: string | number | object;
    }
  }
}
export {};
```

### 14.3 Granting admin access

```ts
// scripts/setAdminClaim.ts
// Usage: npm run admin:grant -- someone@yourdomain.com
import '../src/config/firebase.js';
import { adminAuth } from '../src/config/firebase.js';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run admin:grant -- <email>');
  process.exit(1);
}

const user = await adminAuth.getUserByEmail(email);
await adminAuth.setCustomUserClaims(user.uid, { admin: true, role: 'admin' });
console.log(`✅ Admin claim set for ${email}. The user must sign in again to refresh their token.`);
```

### 14.4 Admin router wiring

```ts
// src/modules/admin/admin.routes.ts
import { Router } from 'express';
import { verifyFirebaseToken, requireAdmin } from '../../middleware/auth.js';

export const adminRouter = Router();

// Everything below requires a valid token AND the admin claim.
adminRouter.use(verifyFirebaseToken, requireAdmin);

// adminRouter.get('/contact-submissions', ...)
// adminRouter.patch('/contact-submissions/:id', ...)
// adminRouter.get('/projects', ...)  etc.
```

### 14.5 Audit logging rule

Every admin write (status change, project create/update/delete) must call a shared `writeAuditLog()` helper in the same Firestore **batch/transaction** as the change, so the audit record can never be skipped.

```ts
// src/lib/audit.ts
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
  batch.set(db.collection('auditLogs').doc(), { ...entry, createdAt: FieldValue.serverTimestamp() });
}
```

---

## 15. Security hardening

### 15.1 Checklist

| Area | Requirement |
|------|-------------|
| **Transport** | HTTPS only in production. Cloud Run and Firebase Hosting provide this by default. |
| **Headers** | `helmet()` enabled. Add a strict CSP only if the API ever serves HTML (it should not). |
| **CORS** | Strict allow-list from `CORS_ORIGINS`. No `*` in production. |
| **Body limits** | `express.json({ limit: '20kb' })`. |
| **Rate limiting** | Global limiter plus a stricter limiter on `POST /contact`. |
| **Validation** | Zod on every body, query, and param. Strip unknown keys. |
| **NoSQL safety** | Never build Firestore paths from raw user input without validation. Slugs are regex-validated. |
| **Secrets** | Only in environment variables / Secret Manager. Never in the repo or the frontend bundle. |
| **PII** | Store minimum fields, hash IPs, define a retention policy (Section 15.6). |
| **Errors** | Generic 500 messages; detailed errors only in server logs. |
| **Dependencies** | Run `npm audit` regularly; pin major versions. |
| **Admin routes** | Token verification with revocation check + custom claim. |
| **Logging** | Redact `authorization` and `cookie` headers; never log message bodies or emails. |

### 15.2 Honeypot and bot defence

Layered, in this order of cost:

1. **Honeypot field** (`website`) – free, catches simple bots.
2. **Rate limiting** – bounds the damage from scripted abuse.
3. **Firebase App Check** *(recommended, Section 15.4)* – proves requests come from the genuine frontend.
4. **Optional CAPTCHA** – only add if spam becomes a real problem; avoid hurting conversion for real users.

### 15.3 CSRF

The public API uses **no cookies** and the admin API uses **bearer tokens in the `Authorization` header**, so classic CSRF does not apply. Do not introduce cookie-based sessions without revisiting this.

### 15.4 App Check (recommended)

1. Register the web app in Firebase App Check using reCAPTCHA Enterprise (or v3).
2. In the frontend, initialise App Check and attach the token as `X-Firebase-AppCheck` on API calls.
3. In the backend, verify it with `getAppCheck().verifyToken(token)` in a middleware applied to `POST /contact`.
4. Roll out in **monitor mode first**, then enforce, to avoid blocking real visitors.

This requires adding the Firebase JS SDK to the frontend. Treat it as an enhancement after the core flow works; it is not required for the first release.

### 15.5 Storage rules

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public project images are readable by anyone; only the backend (Admin SDK) writes.
    match /public/projects/{allPaths=**} {
      allow read: if true;
      allow write: if false;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 15.6 Data retention and privacy

- Enquiries contain personal data (name, email). Decide and document a retention period (for example, archive or delete enquiries after a defined number of months).
- Provide a way to delete a person's enquiry on request (admin script or endpoint).
- The frontend contact form must include a short, honest privacy notice and the consent checkbox. Do not invent legal text; have KeySpex supply or approve the final privacy policy wording.

---

## 16. Email notifications

Purpose: notify KeySpex staff when a new enquiry arrives. **Optional and disabled by default.**

### 16.1 Option A — Nodemailer (provided example)

```ts
// src/lib/mailer.ts
import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter =
  env.mailEnabled && env.SMTP_HOST
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      })
    : null;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export async function sendContactNotification(c: {
  id: string;
  name: string;
  email: string;
  company?: string;
  serviceInterest: string;
  message: string;
}) {
  if (!transporter || !env.MAIL_FROM || !env.MAIL_NOTIFY_TO) return;

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_NOTIFY_TO,
    replyTo: c.email,
    subject: `New KeySpex enquiry from ${c.name.replace(/[\r\n]/g, ' ')}`,
    text: `Name: ${c.name}\nEmail: ${c.email}\nCompany: ${c.company || '-'}\nInterest: ${c.serviceInterest}\n\n${c.message}\n\nReference: ${c.id}`,
    html: `<p><strong>Name:</strong> ${esc(c.name)}<br><strong>Email:</strong> ${esc(c.email)}<br><strong>Company:</strong> ${esc(c.company || '-')}<br><strong>Interest:</strong> ${esc(c.serviceInterest)}</p><p>${esc(c.message).replace(/\n/g, '<br>')}</p><p><small>Reference: ${esc(c.id)}</small></p>`,
  });
}
```

Security notes: strip CR/LF from anything placed in headers (prevents header injection), and HTML-escape everything placed in the HTML body.

### 16.2 Option B — Firebase "Trigger Email" extension

Write a document to a `mail` collection from the service layer and let the extension send it. This removes SMTP code from the API but adds an extension to maintain. Choose one option, not both.

---

## 17. File storage for project images

Project images are uploaded by admins, not by public visitors.

### 17.1 Flow (signed upload URL)

1. Admin client calls `POST /admin/projects/:slug/image` with `{ contentType, fileName }`.
2. The API validates the content type (`image/jpeg`, `image/png`, `image/webp`, `image/avif`) and generates a **V4 signed upload URL** valid for ~10 minutes for the path `public/projects/{slug}/{uuid}.{ext}`.
3. The client uploads directly to Cloud Storage with `PUT`.
4. The client then calls `PATCH /admin/projects/:slug` with the resulting public URL as `coverImageUrl`, along with descriptive `coverImageAlt`.

```ts
const [uploadUrl] = await bucket().file(path).getSignedUrl({
  version: 'v4',
  action: 'write',
  expires: Date.now() + 10 * 60 * 1000,
  contentType,
});
```

### 17.2 Image guidelines (aligned with the frontend brief)

- Use real project visuals supplied by KeySpex; **no random stock imagery**.
- Recommended source size: 1600 px wide minimum for covers; export WebP or AVIF where possible.
- Alt text is mandatory for every image (accessibility).
- Keep file sizes reasonable (target under ~500 KB per cover) to protect page performance.

---

## 18. Frontend integration

All frontend changes must respect the existing KeySpex design rules: minimal luxury-tech, white / black / royal blue (`#0866F5`), generous whitespace, static logo, accessible and responsive components, no unnecessary libraries.

### 18.1 Local development: Vite proxy

`frontend/vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
});
```

With the proxy, `VITE_API_BASE_URL` can stay empty in development and the browser calls `/api/v1/...` on the same origin (no CORS involved). In production either:

- put both behind one domain (Firebase Hosting rewrite to Cloud Run, Section 21), **or**
- set `VITE_API_BASE_URL` to the API's absolute URL and add the frontend origin to `CORS_ORIGINS`.

### 18.2 Shared types — `frontend/src/lib/types.ts`

```ts
export type ServiceInterest =
  | 'website-development'
  | 'custom-digital-solutions'
  | 'digital-growth-optimization'
  | 'other';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: Record<string, string[]> };
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  serviceInterest: ServiceInterest;
  message: string;
  consent: boolean;
  source?: string;
  website?: string; // honeypot
}

export interface ProjectSummary {
  slug: string;
  title: string;
  category: Exclude<ServiceInterest, 'other'>;
  summary: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  isPlaceholder: boolean;
  order: number;
}

export interface ServiceItemData {
  slug: string;
  number: string;
  title: string;
  description: string;
  order: number;
}
```

### 18.3 API client — `frontend/src/lib/api.ts`

```ts
import type { ApiFailure, ApiSuccess, ContactPayload, ProjectSummary, ServiceItemData } from './types';

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') + '/api/v1';

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'Unable to reach the server. Please check your connection.');
  }

  const body = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!res.ok || !body || body.success === false) {
    const err = (body as ApiFailure | null)?.error;
    throw new ApiClientError(
      res.status,
      err?.code ?? 'UNKNOWN',
      err?.message ?? 'Something went wrong. Please try again.',
      err?.details,
    );
  }
  return body.data;
}

export const api = {
  submitContact: (payload: ContactPayload) =>
    request<{ id: string; message: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getProjects: (limit = 6) => request<ProjectSummary[]>(`/projects?limit=${limit}`),

  getServices: () => request<ServiceItemData[]>('/services'),
};
```

### 18.4 Contact form — `frontend/src/components/landing/ContactForm.tsx`

Build this as its own component and import it into `ContactSection.tsx` (consistent with the component-first rule). Use Shadcn `Button`, plus `Input`, `Textarea`, `Label`, and `Checkbox` primitives added via the Shadcn CLI, customised to KeySpex styling.

Required behaviour:

| Requirement | Detail |
|-------------|--------|
| **Fields** | Name, Email, Company (optional), "I'm interested in" (select of the three services + Other), Message, consent checkbox |
| **Honeypot** | A visually hidden input named `website`, `tabIndex={-1}`, `autoComplete="off"`, wrapped in `aria-hidden="true"` |
| **Client validation** | Mirror server rules for fast feedback; the server remains authoritative |
| **Server errors** | Map `error.details` field errors back to each field; show a general message for others |
| **States** | `idle` → `submitting` (button disabled, label "Sending…") → `success` or `error` |
| **Success** | Replace the form with a short confirmation message; no confetti, no extra animation |
| **Accessibility** | Visible labels, `aria-invalid`, `aria-describedby` for errors, a live region (`role="status"`) for success and `role="alert"` for failures, visible focus rings |
| **Design** | Generous spacing, minimal borders, royal-blue focus and primary button, no cards-within-cards |
| **Copy** | Heading from the brief's contact CTA ("Start a Conversation"); do not invent contact details |

Skeleton:

```tsx
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { api, ApiClientError } from '@/lib/api';
import type { ContactPayload, ServiceInterest } from '@/lib/types';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm({ source = 'landing-contact-section' }: { source?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setFormError(null);
    setFieldErrors({});

    const fd = new FormData(e.currentTarget);
    const payload: ContactPayload = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      serviceInterest: String(fd.get('serviceInterest') ?? 'other') as ServiceInterest,
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on',
      website: String(fd.get('website') ?? ''),
      source,
    };

    try {
      await api.submitContact(payload);
      setStatus('success');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setFieldErrors(err.fieldErrors ?? {});
        setFormError(err.message);
      } else {
        setFormError('Something went wrong. Please try again.');
      }
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="py-8">
        <h3 className="text-2xl font-semibold text-[#090B10]">Thank you.</h3>
        <p className="mt-2 text-[#64748B]">We've received your message and will be in touch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot – hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Name, Email, Company, Interest, Message, Consent fields go here,
          each as a labelled input with its own error message region. */}

      {formError && (
        <p role="alert" className="text-sm text-red-600">
          {formError}
        </p>
      )}

      <Button type="submit" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending…' : "Let's Talk"}
      </Button>
    </form>
  );
}
```

> The skeleton intentionally omits the field markup; build it with the project's Shadcn primitives and the design rules above. Do not use an HTML `<form>` replacement library; the native form with `FormData` is enough.

### 18.5 Selected Work and Services with graceful fallback

Rule: **the page must never appear broken when the API is down or the database is empty.**

Pattern for `PortfolioSection.tsx`:

1. Keep a small static `fallbackProjects` array in the frontend containing clearly labelled placeholders (`isPlaceholder: true`).
2. Render the fallback immediately (no layout shift).
3. Fetch `api.getProjects()` in an effect (or a lightweight data hook). If it succeeds and returns at least one project, swap to the API data; otherwise keep the fallback.
4. For any project with `isPlaceholder: true`, show a subtle "Sample project" label so visitors are never misled.
5. Reserve image aspect ratios (e.g. `aspect-[4/3]`) to avoid layout shift.

Apply the same pattern to services: the three approved services stay as static defaults, and `api.getServices()` may override them when available.

> Do **not** add a data-fetching library (React Query, SWR) for this. A small custom hook is sufficient for two read-only calls. Revisit this when the dashboards arrive.

### 18.6 Navbar and CTA wiring

- "Let's Talk" (navbar and hero) and "Start a Conversation" (contact section) should smooth-scroll to `#contact`.
- Optionally pass a different `source` value to track which CTA led to the enquiry (e.g. `landing-navbar-cta`).
- Keep the logo static and untouched; the backend must not influence logo rendering.

---

## 19. Seeding and local development

### 19.1 Run order (daily workflow)

```bash
# Terminal 1 – Firebase emulators
firebase emulators:start --only firestore,auth,storage

# Terminal 2 – Backend (with emulator env vars set)
cd backend
export FIRESTORE_EMULATOR_HOST=127.0.0.1:8081
export FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
export FIREBASE_STORAGE_EMULATOR_HOST=127.0.0.1:9199
npm run seed
npm run dev

# Terminal 3 – Frontend
cd frontend
npm run dev
```

### 19.2 `firebase.json`

```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "emulators": {
    "auth": { "port": 9099 },
    "firestore": { "port": 8081 },
    "storage": { "port": 9199 },
    "ui": { "enabled": true, "port": 4001 }
  }
}
```

With the API on port 4000 (`PORT=4000`) and Vite proxying `/api` to it, there are no port conflicts.

### 19.3 `scripts/seed.ts`

```ts
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../src/config/firebase.js';

const services = [
  {
    slug: 'website-development',
    number: '01',
    title: 'Website Development',
    description:
      "Responsive, carefully crafted websites designed to communicate a business's value, establish trust, and convert visitors into customers.",
    order: 1,
  },
  {
    slug: 'custom-digital-solutions',
    number: '02',
    title: 'Custom Digital Solutions',
    description:
      'Purpose-built digital products and business tools designed around customer needs and business workflows.',
    order: 2,
  },
  {
    slug: 'digital-growth-optimization',
    number: '03',
    title: 'Digital Growth & Optimization',
    description: 'Practical improvements to digital presence, usability, and customer experience.',
    order: 3,
  },
];

// Clearly marked placeholders – NOT real client work.
const projects = [1, 2, 3].map((n) => ({
  slug: `placeholder-project-${n}`,
  title: `Sample Project ${n}`,
  category: (['website-development', 'custom-digital-solutions', 'digital-growth-optimization'] as const)[n - 1],
  summary: 'A placeholder entry to be replaced with real KeySpex work.',
  description: '',
  coverImageUrl: null,
  coverImageAlt: 'Placeholder artwork for a sample project',
  gallery: [],
  projectUrl: null,
  isPlaceholder: true,
  published: true,
  order: n,
}));

const batch = db.batch();
for (const { slug, ...s } of services) {
  batch.set(db.collection('services').doc(slug), { ...s, published: true, updatedAt: FieldValue.serverTimestamp() });
}
for (const { slug, ...p } of projects) {
  batch.set(db.collection('projects').doc(slug), {
    slug,
    ...p,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}
batch.set(db.collection('siteSettings').doc('public'), {
  contactEmail: null, // Fill in only with a genuine address supplied by KeySpex.
  socialLinks: [],
  updatedAt: FieldValue.serverTimestamp(),
});

await batch.commit();
console.log('✅ Seed complete (services + placeholder projects).');
```

> The seed script must be **idempotent** (re-running it overwrites the same document IDs) and must refuse to run against production unless explicitly forced (e.g. guard with `if (env.isProd && !process.env.ALLOW_PROD_SEED) process.exit(1)`).

---

## 20. Testing

### 20.1 Tools

Vitest + Supertest against the Express app from `createApp()`, running with the Firebase Emulator Suite:

```bash
firebase emulators:exec --only firestore,auth "npm --prefix backend test"
```

### 20.2 Required test cases

**Contact**

- ✔ Valid payload → `201` and a document exists in `contactSubmissions` with `status: "new"`.
- ✔ Missing or invalid email → `400` with a field error.
- ✔ `consent: false` → `400`.
- ✔ Message too short / too long → `400`.
- ✔ Honeypot filled → `201` but **no** document stored.
- ✔ Stored document contains `ipHash` and **not** a raw IP.
- ✔ Sixth request within the window → `429`.
- ✔ Unknown extra fields are not persisted.

**Projects / services**

- ✔ `GET /projects` returns only `published: true` documents, ordered by `order`.
- ✔ `limit` above 12 is rejected or clamped.
- ✔ `GET /projects/:slug` returns `404` for unpublished or missing slugs.
- ✔ Responses never contain internal fields.

**Admin**

- ✔ No token → `401`.
- ✔ Valid token without `admin` claim → `403`.
- ✔ Admin token → `200` on list endpoints.
- ✔ Status update writes an `auditLogs` entry in the same batch.
- ✔ Duplicate project slug → `409`.

**Platform**

- ✔ Unknown route → `404` in the standard envelope.
- ✔ Malformed JSON → `400 BAD_JSON`.
- ✔ Oversized body → `413`.
- ✔ Disallowed CORS origin does not receive CORS headers.

### 20.3 Frontend checks

- The contact form submits, shows field errors, shows success, and handles network failure.
- Portfolio and services render correctly with the API **off** (fallback content) and **on**.
- Keyboard navigation and screen-reader labels work on the form.
- No horizontal overflow at 390 px, 768 px, and 1440 px.

---

## 21. Deployment

### 21.1 Recommended: Cloud Run + Firebase Hosting

| Piece | Where it runs |
|-------|---------------|
| Frontend (static build) | Firebase Hosting |
| API | Cloud Run (container) |
| Database / Auth / Storage | Firebase |

Firebase Hosting rewrites `/api/**` to Cloud Run so the browser sees **one origin** (no CORS needed in production).

```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "/api/**", "run": { "serviceId": "keyspex-api", "region": "asia-south1" } },
      { "source": "**", "destination": "/index.html" }
    ]
  }
}
```

(Choose the Cloud Run region to match your Firestore region; confirm it with the owner.)

### 21.2 `backend/Dockerfile`

```dockerfile
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8080
# Cloud Run injects PORT (8080). Our env.ts reads PORT.
USER node
CMD ["node", "dist/src/server.js"]
```

### 21.3 Deploy steps

```bash
# 1. Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes,storage

# 2. Build and deploy the API
gcloud run deploy keyspex-api \
  --source backend \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,FIREBASE_PROJECT_ID=<id>,API_PREFIX=/api/v1,CORS_ORIGINS=https://<your-domain> \
  --set-secrets IP_HASH_SALT=ip-hash-salt:latest

# 3. Build and deploy the frontend
cd frontend && npm run build && cd ..
firebase deploy --only hosting
```

Notes:

- `--allow-unauthenticated` is correct: the API itself enforces auth for admin routes.
- Store `IP_HASH_SALT` and any SMTP credentials in **Secret Manager**, not plain environment variables.
- Grant the Cloud Run runtime service account only the Firestore and Storage roles it needs (principle of least privilege).
- Set a sensible max-instances value to cap cost if abused.

### 21.4 Alternative: Cloud Functions (2nd gen)

`createApp()` can be wrapped in a single HTTPS function (`onRequest(createApp())`) and Hosting can rewrite `/api/**` to it. Cloud Run is preferred because it keeps the Express app portable and avoids function-specific constraints.

### 21.5 CI (suggested)

On every pull request: install → lint → typecheck → test (emulators) → build for both `backend/` and `frontend/`. Block merges on failure.

### 21.6 Monitoring

- Use Cloud Logging (JSON logs from pino are parsed automatically).
- Add an uptime check on `/api/v1/health/ready`.
- Alert on a spike of 5xx responses or `429` responses.

---

## 22. Phase 2: dashboards data model

**Not part of the current build.** This section only ensures Phase 1 decisions do not block the planned Admin, Employee, and Client dashboards. Do not implement any of this until the landing page is complete and the owner approves Phase 2.

### 22.1 Roles

| Role | Custom claim | Access |
|------|--------------|--------|
| Admin | `role: "admin"`, `admin: true` | Everything |
| Employee | `role: "employee"` | Own salary, assigned projects/tasks, own payment timeline, salary slips, contracts |
| Client | `role: "client"`, `clientId` | Own projects, budgets/expenses, contracts, payment timeline, subscription |

The Phase 1 middleware already reads `role`; extend it with `requireRole(...roles)` and **ownership checks** (a client may only read documents where `clientId` matches their claim; an employee only where `employeeId` matches).

### 22.2 Candidate collections

`users`, `clients`, `employees`, `projects` *(internal projects; separate from the public portfolio — rename the public one to `portfolioProjects` before Phase 2 to avoid collision)*, `tasks`, `contracts`, `payments`, `payroll`, `salarySlips`, `subscriptions`, `events`, `notifications`, `activityLogs`.

### 22.3 Non-negotiable data rules (from the dashboard brief)

- **Every monetary amount stores its currency** (`{ amount: number, currency: 'INR' }`). Use integer minor units (e.g. paise) to avoid floating-point errors.
- **Never combine or sum different currencies** without an explicit, stored conversion rate and date.
- **Preserve financial and audit history.** Payments, payroll, and contracts are append-only or versioned; use status changes, not deletions.
- **Privacy boundaries** between Admin, Employee, and Client are enforced **in the API** (and mirrored by Firestore rules if direct client access is ever introduced).
- Keep `auditLogs` (Section 10.6) as the single audit trail and extend it as needed.

> Recommendation: when Phase 2 starts, rename the public collection to `portfolioProjects` and the route to `/portfolio`, keeping `/projects` free for internal project management. Doing it before real data exists is trivial.

---

## 23. Final verification checklist

**Do not claim any item is complete unless the command or check was actually run and its result observed.** Report failures honestly, with output.

### Backend

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes.
- [ ] `npm test` passes against the emulators.
- [ ] `npm run build` succeeds and `npm start` boots the compiled server.
- [ ] `GET /api/v1/health` and `/health/ready` return `200`.
- [ ] `POST /api/v1/contact` stores a document and returns `201` (verified in the emulator UI).
- [ ] Honeypot submissions store nothing.
- [ ] Rate limiter returns `429` after the configured limit.
- [ ] `GET /projects` and `/services` return only published items in order.
- [ ] Admin endpoints reject missing tokens (`401`) and non-admin tokens (`403`).
- [ ] Audit logs are written for admin changes.
- [ ] Firestore and Storage rules deny direct client access.
- [ ] No secrets are committed (`serviceAccountKey.json`, `.env`).
- [ ] `.env.example` files are complete and contain no real credentials.
- [ ] `npm audit` reviewed; no unresolved high-severity issues without a documented reason.

### Frontend integration

- [ ] `VITE_API_BASE_URL` / proxy configured; no hard-coded localhost URLs in source.
- [ ] `ContactForm` is its own component and is imported into `ContactSection`.
- [ ] Form shows field errors, success state, and network-failure state.
- [ ] Honeypot is hidden from users and assistive technology.
- [ ] Portfolio and services render with the API off (fallback) and on.
- [ ] Placeholder projects display a "Sample project" label.
- [ ] `npm run build` in `frontend/` succeeds with no TypeScript errors.
- [ ] No layout shift when API data replaces fallback data.
- [ ] No horizontal overflow at 390 px, 768 px, and 1440 px.
- [ ] Logo remains static and unmodified.
- [ ] Brand rules intact: white, black, royal blue `#0866F5`, no new unrelated colours.

### Content honesty

- [ ] No fabricated clients, testimonials, statistics, awards, certifications, or contact details anywhere in seed data, emails, or UI copy.
- [ ] Contact email and social links remain `null` / empty until real values are provided.

---

## 24. Master instruction for AI coding agents

Copy the block below when asking an AI agent to continue this work.

> I am building the backend for the KeySpex website, a premium custom digital-solutions brand ("Custom Digital Solutions for Real Businesses."). The frontend is React + Vite + TypeScript + Tailwind CSS + Shadcn UI and already exists in `frontend/`. Inspect it first and preserve its working configuration.
>
> Build a Node.js + Express + TypeScript API in `backend/` using Firebase (Firestore, Auth, Storage) through the Firebase Admin SDK. The browser must never access Firestore directly; Firestore and Storage rules deny all client access.
>
> Follow `backend.md` exactly: the folder structure, route → controller → service layering, Zod validation on every input, the `{ success, data | error }` response envelope, rate limiting, helmet, strict CORS, and salted IP hashing. Implement modules one at a time (health, contact, projects, services, admin), each with tests.
>
> Phase 1 covers: the contact/"Let's Talk" endpoint with honeypot and rate limiting, public published-projects and services endpoints, an admin API protected by Firebase ID tokens with an `admin` custom claim, audit logging for admin writes, a seed script, and Firebase Emulator Suite support.
>
> Integrate the frontend with a typed `src/lib/api.ts` client and a separate `ContactForm` component imported into `ContactSection`. The portfolio and services sections must fall back to static content when the API is unavailable. Do not add data-fetching libraries, and do not change the logo or the KeySpex visual identity (white, deep black, royal blue `#0866F5`; minimal luxury-tech).
>
> Never fabricate client names, testimonials, statistics, certifications, awards, or contact details. Mark all sample content `isPlaceholder: true` and label it in the UI.
>
> Do not implement the Admin / Employee / Client dashboards yet; only keep the architecture compatible with Section 22.
>
> Run typecheck, lint, tests, and builds for both projects, and do not claim success for any check you did not actually run.
