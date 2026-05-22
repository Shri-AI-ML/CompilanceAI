# ComplianceOS AI - Developer Task Runner Makefile
# Supports Windows (via Git Bash/WSL) and Unix/Linux environments.

.PHONY: setup migrate seed reset-db run-dev clean-db

# 1. Developer Environment Onboarding
setup:
	@echo "======================================================="
	@echo "Setting up ComplianceOS AI development environment..."
	@echo "======================================================="
	pnpm install
	@if [ -d "backend" ]; then \
		cd backend && \
		python -m venv .venv && \
		if [ -f ".venv/Scripts/pip" ]; then \
			.venv/Scripts/pip install -r requirements.txt; \
		else \
			.venv/bin/pip install -r requirements.txt; \
		fi \
	fi
	@echo "Setup completed successfully."

# 2. Database Migrations alignment
migrate:
	@echo "Running Alembic migrations..."
	@if [ -f "backend/.venv/Scripts/alembic" ]; then \
		cd backend && .venv/Scripts/alembic upgrade head; \
	elif [ -f "backend/.venv/bin/alembic" ]; then \
		cd backend && .venv/bin/alembic upgrade head; \
	else \
		cd backend && alembic upgrade head; \
	fi

# 3. Seeding high quality enterprise assets
seed:
	@echo "Seeding the database..."
	@if [ -f "backend/.venv/Scripts/python" ]; then \
		cd backend && .venv/Scripts/python app/scripts/seed.py; \
	elif [ -f "backend/.venv/bin/python" ]; then \
		cd backend && .venv/bin/python app/scripts/seed.py; \
	else \
		cd backend && python app/scripts/seed.py; \
	fi

# 4. Destructive Database Reset (Development Safeguard Enforced)
reset-db:
	@echo "Resetting database..."
	@if [ -f "backend/.venv/Scripts/python" ]; then \
		cd backend && .venv/Scripts/python app/scripts/reset_db.py; \
	elif [ -f "backend/.venv/bin/python" ]; then \
		cd backend && .venv/bin/python app/scripts/reset_db.py; \
	else \
		cd backend && python app/scripts/reset_db.py; \
	fi

# 5. One-Command Local Startup (Spins up DB/Redis, runs frontend & backend concurrently)
run-dev:
	@echo "Spinning up local Docker services (Postgres, Redis, Qdrant)..."
	-docker compose up -d
	@echo "Starting development servers..."
	pnpm dev
