# KeySpex

> High-performance digital craftsmanship, enterprise engineering, and administrative workspace platform.

---

## 📁 Repository Architecture

This repository contains both the client frontend and backend services:

```
keyspex-Community/
├── backend/            # Express.js + TypeScript REST API & Firebase Admin Service
│   ├── src/
│   │   ├── config/     # Environment, Firebase Admin, and service configuration
│   │   ├── middleware/ # Auth verification, rate limiting, error handling
│   │   └── modules/    # Projects, contact, services, and health endpoints
│   ├── .env.example    # Backend environment variable template
│   └── package.json
│
├── keyspex/            # React 19 + Vite 8 + Tailwind CSS v4 Frontend & Admin Portal
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin-components/ # Isolated Admin UI primitives, charts, and layout
│   │   │   ├── landing/          # Public landing page sections
│   │   │   ├── layout/           # Shared navigation and layout components
│   │   │   └── ui/               # Radix UI primitives & design elements
│   │   ├── pages/                # Route components (HomePage, AdminLoginPage, AdminDashboardPage)
│   │   ├── lib/                  # Firebase Auth service, INR formatters, utilities
│   │   └── styles/               # Design tokens and Tailwind styles
│   ├── .env.example    # Frontend environment variable template
│   └── package.json
│
├── .gitignore          # Root repository ignore rules
└── README.md           # Workspace guide
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** (or pnpm / yarn)

---

### 2. Frontend Setup (`keyspex`)

```bash
cd keyspex

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run development server
npm run dev
```

The application will be accessible at:
- **Public Website**: `http://localhost:5173/`
- **Admin Authentication**: `http://localhost:5173/admin/login`
- **Admin Dashboard**: `http://localhost:5173/admin/dashboard`

---

### 3. Backend Setup (`backend`)

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run backend API server
npm run dev
```

API server will be running on `http://localhost:4000/api/v1`.

---

## 🔐 Authentication & Roles

The platform supports authentication across 3 distinct roles:
1. **Admin**: Full administrative dashboard, financial overview, projects, and employee oversight.
2. **Employee**: Internal staff workspace, assignments, and operations.
3. **Client**: External client deliverables, payment timelines, and project reviews.

### Demo Credentials:
- **Admin**: `superadmin` / `admin2026`
- **Employee**: `riya.hr` / `admin2026`
- **Client**: `apex.client` / `admin2026`

---

## 🛠️ Verification & Build Commands

```bash
# Build frontend
cd keyspex
npm run build
npm run lint

# Build backend
cd ../backend
npm run build
```

---

## 📄 License

Private & Confidential • KeySpex
