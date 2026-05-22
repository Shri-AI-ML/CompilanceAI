import asyncio
from contextlib import asynccontextmanager
import logging
import sys
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.core.database import engine
from app.api.v1.api import api_router

logger = logging.getLogger(__name__)

async def verify_database_connection():
    max_retries = 5
    retry_delay = 2
    
    logger.info("Performing startup database connection verification...")
    for attempt in range(1, max_retries + 1):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            logger.info("Database connectivity verified successfully.")
            return True
        except Exception as e:
            logger.warning(
                f"Database connection attempt {attempt}/{max_retries} failed: {e}. "
                f"Retrying in {retry_delay}s..."
            )
            if attempt < max_retries:
                await asyncio.sleep(retry_delay)
            else:
                logger.error("Failed to connect to the database after maximum retries.")
                return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Verify database connection at startup
    db_connected = await verify_database_connection()
    if not db_connected:
        print("\n=======================================================", file=sys.stderr)
        print("FATAL DATABASE ERROR: Could not connect to the database.", file=sys.stderr)
        print("Please ensure your PostgreSQL instance is running and accessible.", file=sys.stderr)
        print("=======================================================\n", file=sys.stderr)
        sys.exit(1)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="ComplianceOS AI API - Enterprise AI-Native Compliance Platform",
    version="0.1.0",
    lifespan=lifespan,
)


# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        # pyrefly: ignore [unnecessary-type-conversion]
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


# Root landing redirect/message
@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Welcome to the ComplianceOS AI API Service",
        "docs": "/docs",
        "version": "0.1.0"
    }


# Include API v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)
