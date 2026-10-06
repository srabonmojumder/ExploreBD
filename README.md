# ExploreBD — Bangladesh Travel Exploration Platform 🇧🇩

A modern, full-stack social travel exploration and tracking platform engineered specifically for Bangladesh. ExploreBD enables travelers to discover places across all **8 Divisions** and **64 Districts**, track multiple visits, calculate genuine exploration percentages, unlock achievements, and compete on the explorer leaderboard.

---

## 🏛️ Project Architecture

```text
ExploreBD/
├── backend/                  # Node.js + Express + TypeScript + PostgreSQL + Prisma
│   ├── prisma/
│   │   └── schema.prisma     # Normalized PostgreSQL Schema (11 models)
│   ├── src/
│   │   ├── config/           # Environment & App configuration
│   │   ├── controllers/      # Express controllers
│   │   ├── services/         # Core business logic layer
│   │   ├── repositories/     # Prisma client singleton
│   │   ├── routes/           # REST API route handlers
│   │   ├── middlewares/      # Error handler, validation, security
│   │   ├── scripts/          # Native PostgreSQL cluster runner
│   │   ├── utils/            # ApiResponse, ApiError
│   │   ├── app.ts            # Express application setup
│   │   └── server.ts         # Server bootstrap
│   └── .env.example
├── frontend/                 # Next.js 15 (App Router) + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/              # Next.js App Router (Layout, Home, Pages)
│   │   ├── components/       # UI & Domain components
│   │   │   ├── layout/       # Navbar, Footer
│   │   │   └── home/         # ApiStatusCard, DivisionPreview
│   │   ├── lib/              # API Client & TanStack Query Provider
│   │   └── stores/           # Zustand global state (drawer, filters)
│   └── tailwind.config.ts    # Custom Bangladesh emerald/teal palette
└── package.json              # Root workspace orchestration
```

---

## 📦 Phase 1 Foundation Status

- [x] **Repository Structure**: Logically separated `frontend/` and `backend/` monorepo workspaces.
- [x] **PostgreSQL & Prisma**: Complete schema with 11 models (`User`, `Division`, `District`, `Place`, `PlaceImage`, `Visit`, `Review`, `Achievement`, `UserAchievement`, `Follow`, `RefreshToken`).
- [x] **Zero-Config Database**: Embedded native PostgreSQL cluster running on port `5432`, data persisted in `backend/data/pgdata`.
- [x] **Backend API**: Strict TypeScript, Controller → Service → Repository architecture, centralized error handling, Zod validation, Helmet, CORS.
- [x] **Health Check Endpoint**: `/api/health` verifying live PostgreSQL query latency and system health.
- [x] **Frontend Application**: Next.js 15, Tailwind CSS, TanStack Query, Zustand, Lucide React, and glassmorphic travel design system.
- [x] **Live Communication**: Real-time frontend-to-backend communication card displaying API and database status.
- [x] **Strict Verification**: Zero TypeScript errors (`tsc --noEmit`), zero lint errors, production builds verified.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v9+)

### Installation

```bash
# Install all dependencies across both workspaces
npm install
```

### Running Locally

```bash
# 1. Start the PostgreSQL cluster (port 5432)
npm run db:server

# 2. Push Prisma schema to the database (if needed)
npm run db:push

# 3. Start both Backend (port 5000) and Frontend (port 3000) concurrently
npm run dev
```

Alternatively, run each service independently:

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
