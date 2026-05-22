# ComplianceOS AI

ComplianceOS AI is an enterprise AI-native compliance workflow platform. This monorepo uses `pnpm` workspaces for frontend orchestration alongside a FastAPI backend.

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend**: FastAPI (Python 3.11+), SQLAlchemy 2.0 (asyncpg), Alembic
- **Database**: PostgreSQL
- **Caching**: Redis
- **Vector Search**: Qdrant
- **AI Integrations**: OpenRouter API

---

## Directory Structure

```
.
├── frontend/                  # Next.js 15 App
├── backend/                   # FastAPI Server
├── docker-compose.yml         # Development backing services (PG, Redis, Qdrant)
├── pnpm-workspace.yaml        # Workspace configuration
└── package.json               # Root scripts
```

---

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- `pnpm` (v9+ or newer) installed globally
- Python 3.11+
- Docker & Docker Compose

### Initializing Environment

1. **Clone the repository** and navigate to the directory:
   ```bash
   cd "ComplianceOS AI"
   ```

2. **Copy environment files**:
   ```bash
   copy .env.example .env
   copy frontend\.env.example frontend\.env
   copy backend\.env.example backend\.env
   ```

### Unified Onboarding & Developer Commands

We provide a `Makefile` and `package.json` scripts for streamlined onboarding.

#### 1. Setup Workspace (One-Command Onboarding)
Install node modules, create the backend Python virtual environment, and install dependencies:
```bash
make setup
# OR using pnpm:
pnpm run setup
```

#### 2. Run Local Development (One-Command Startup)
Spin up the Docker backing services (Postgres, Redis, Qdrant) and start the backend and frontend servers concurrently:
```bash
make run-dev
# OR using pnpm:
pnpm run dev
```

#### 3. Database Management Helper Commands
We provide safe utilities to manage development databases:

- **Run Alembic Migrations**:
  ```bash
  make migrate
  # OR using pnpm:
  pnpm run migrate
  ```

- **Seed Development Data**:
  Inserts realistic, enterprise-grade mock data (users, organizations, memberships, and detailed compliance audit logs):
  ```bash
  make seed
  # OR using pnpm:
  pnpm run seed
  ```

- **Reset Development Database**:
  Destroys the current local schema cascade, applies fresh Alembic migrations, and runs the seed script. **Features strict development safeguards to prevent execution in production settings**:
  ```bash
  make reset-db
  # OR using pnpm:
  pnpm run reset-db
  ```

---

The frontend will be available at `http://localhost:3000` and the backend Swagger documentation will be available at `http://localhost:8000/docs`.

