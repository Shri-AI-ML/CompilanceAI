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
- `pnpm` installed globally
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

3. **Start Backing Services**:
   ```bash
   docker compose up -d
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run tests:
   ```bash
   pytest
   ```
5. Run the dev server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Install global `pnpm` if you don't have it:
   ```bash
   npm install -g pnpm
   ```
2. Install frontend dependencies from the root directory:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev:frontend
   ```

The frontend will be available at `http://localhost:3000` and the backend Swagger documentation will be available at `http://localhost:8000/docs`.
