import asyncio
import os
import subprocess
import sys
# pyrefly: ignore [missing-import]
from sqlalchemy import text

# Setup python path to import app core
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.core.config import settings
from app.core.database import engine
from app.scripts.seed import seed_data


def check_production_safeguard():
    """Refuse to run if settings environment indicates production."""
    env = settings.ENV.lower()
    if env not in ("development", "test"):
        print("\n=======================================================", file=sys.stderr)
        print("CRITICAL VIOLATION: Accidental destructive database reset prevented!", file=sys.stderr)
        print(f"Current Environment: {settings.ENV}", file=sys.stderr)
        print("This reset script can ONLY be run in 'development' or 'test'.", file=sys.stderr)
        print("=======================================================\n", file=sys.stderr)
        sys.exit(1)


async def confirm_reset(force: bool):
    """Require interactive user confirmation unless --force or -f is specified."""
    if force:
        print("Force flag detected. Proceeding with database reset...")
        return
        
    print("\nWARNING: This will drop ALL tables, recreate the schema, and seed new data.")
    print("ALL existing data will be permanently deleted.")
    confirm = input("Type 'confirm' to proceed with the reset: ").strip()
    if confirm != "confirm":
        print("Database reset aborted.")
        sys.exit(0)


async def main():
    check_production_safeguard()
    
    # Check for force flag in arguments
    force = "--force" in sys.argv or "-f" in sys.argv or "FORCE" in os.environ
    
    await confirm_reset(force)

    print("\nStarting database reset stabilization...")
    
    # 1. Drop public schema and recreate it to get a completely empty database
    try:
        print("Connecting to database to clear schema...")
        async with engine.begin() as conn:
            print("Dropping existing public schema...")
            await conn.execute(text("DROP SCHEMA IF EXISTS public CASCADE;"))
            print("Recreating public schema...")
            await conn.execute(text("CREATE SCHEMA public;"))
            print("Granting public schema permissions...")
            await conn.execute(text("GRANT ALL ON SCHEMA public TO public;"))
            await conn.execute(text("GRANT ALL ON SCHEMA public TO postgres;"))
        print("Database schema successfully cleared.")
    except Exception as e:
        print(f"FATAL: Failed to drop/recreate database schema: {e}", file=sys.stderr)
        sys.exit(1)

    # 2. Run Alembic migrations to construct the clean, versioned schema
    backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    print(f"Running Alembic migrations in: {backend_dir}...")
    try:
        # Determine Alembic executable (windows/linux compatibility)
        alembic_cmd = "alembic"
        if sys.platform == "win32":
            venv_alembic = os.path.join(backend_dir, ".venv", "Scripts", "alembic.exe")
            if os.path.exists(venv_alembic):
                alembic_cmd = venv_alembic
        
        result = subprocess.run(
            [alembic_cmd, "upgrade", "head"],
            cwd=backend_dir,
            shell=sys.platform == "win32",
            check=True
        )
        print("Alembic migrations completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"FATAL: Alembic migration failed with exit code {e.returncode}.", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"FATAL: Failed to execute Alembic upgrade: {e}", file=sys.stderr)
        sys.exit(1)

    # 3. Seed the newly migrated database
    print("Executing database seeding...")
    try:
        async with engine.begin() as conn:
            # We seed inside the same transaction or open a session
            # Since seed_data takes an AsyncSession, let's yield a session
            from app.core.database import AsyncSessionLocal
            async with AsyncSessionLocal() as session:
                await seed_data(session)
        print("Database reset and seeding completed successfully!")
    except Exception as e:
        print(f"FATAL: Database seeding failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
