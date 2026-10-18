# KeySpex Backend API

Node.js 20 LTS · Express 4 · TypeScript (strict) · Firebase Admin SDK

## Prerequisites

- Node.js 20 LTS or newer
- Firebase CLI: `npm install -g firebase-tools`
- A Firebase project (Firestore, Auth, Storage enabled on Blaze plan for production)

## Quick Start — Local Development with Emulators

```bash
# From the backend/ folder:
npm install
cp .env.example .env
# Edit .env: set FIREBASE_PROJECT_ID and IP_HASH_SALT (min 16 chars)

# Terminal A (project root) — start emulators
firebase emulators:start --only firestore,auth,storage
# Firestore: 8081  Auth: 9099  Storage: 9199  UI: 4001

# Terminal B (backend/) — seed and start API
$env:FIRESTORE_EMULATOR_HOST="127.0.0.1:8081"
$env:FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:9099"
$env:FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:9199"
npm run seed
npm run dev
# API: http://localhost:4000/api/v1

# Terminal C (keyspex/) — frontend
npm run dev
# Frontend: http://localhost:5173  (proxies /api to 4000)
```

## Environment Variables

See `.env.example`. Essential ones:

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| `FIREBASE_PROJECT_ID` | Yes | — | Your Firebase project ID |
| `IP_HASH_SALT` | Yes | — | Random string >= 16 chars |
| `FIREBASE_STORAGE_BUCKET` | For images | — | `<project-id>.appspot.com` |
| `PORT` | No | `4000` | API port |
| `CORS_ORIGINS` | No | `http://localhost:5173` | Comma-separated |
| `MAIL_ENABLED` | No | `false` | `true` to enable notifications |

## Scripts

```bash
npm run dev              # Hot-reload dev server
npm run build            # Compile to dist/
npm start                # Run compiled build
npm run typecheck        # Type-check only
npm run lint             # ESLint
npm test                 # Vitest (requires emulators)
npm run seed             # Seed Firestore
npm run admin:grant -- user@example.com  # Grant admin claim
```

## API Reference

### Public endpoints
| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/v1/health` | Liveness |
| GET | `/api/v1/health/ready` | Readiness (Firestore ping) |
| POST | `/api/v1/contact` | Submit enquiry — rate-limited 5/hour |
| GET | `/api/v1/projects` | Published projects, `?category=&limit=` |
| GET | `/api/v1/projects/:slug` | Single published project |
| GET | `/api/v1/services` | Published services |

### Admin endpoints — require `Authorization: Bearer <ID token>` + `admin: true` claim
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/admin/contact-submissions` | List enquiries |
| GET | `/api/v1/admin/contact-submissions/:id` | Enquiry detail |
| PATCH | `/api/v1/admin/contact-submissions/:id` | Update status/notes |
| GET | `/api/v1/admin/projects` | All projects incl. unpublished |
| POST | `/api/v1/admin/projects` | Create project |
| PATCH | `/api/v1/admin/projects/:slug` | Update project |
| DELETE | `/api/v1/admin/projects/:slug` | Delete project |
| POST | `/api/v1/admin/projects/:slug/image` | Get signed upload URL |
| PUT | `/api/v1/admin/services/:slug` | Upsert service |
| GET | `/api/v1/admin/audit-logs` | Audit trail |

## Deployment

```bash
# 1. Deploy Firestore rules + indexes + Storage rules
firebase deploy --only firestore:rules,firestore:indexes,storage

# 2. Deploy API to Cloud Run (from project root)
gcloud run deploy keyspex-api \
  --source backend \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,FIREBASE_PROJECT_ID=<id>,API_PREFIX=/api/v1 \
  --set-secrets IP_HASH_SALT=ip-hash-salt:latest

# 3. Build and deploy frontend
cd keyspex && npm run build && cd ..
firebase deploy --only hosting
```

## Before Going to Production

- Replace `your-firebase-project-id` in `.firebaserc`
- Create first admin user in Firebase Console (Auth), then run `npm run admin:grant`
- Add real `IP_HASH_SALT` to Secret Manager
- Configure SMTP if email notifications are needed
- Have KeySpex supply approved privacy policy text for the contact form
