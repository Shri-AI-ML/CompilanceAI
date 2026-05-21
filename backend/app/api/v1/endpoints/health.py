from fastapi import APIRouter, Depends
# pyrefly: ignore [missing-import]
from sqlalchemy import text
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.schemas.health import HealthCheck

router = APIRouter()


@router.get("/", response_model=HealthCheck)
async def check_health(db: AsyncSession = Depends(deps.get_db)) -> HealthCheck:
    """
    Perform a health check on the API and its backend dependencies.
    """
    # 1. Check Database connection
    database_status = "unhealthy"
    try:
        # Run a simple SELECT 1 statement to verify DB connectivity
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            database_status = "healthy"
    except Exception as e:
        database_status = f"unhealthy: {str(e)}"

    # 2. Check Redis connection (stubbed/ready for active check)
    redis_status = "healthy (configured)"
    if not settings.REDIS_URL:
        redis_status = "not_configured"

    return HealthCheck(
        status="healthy",
        version="0.1.0",
        environment=settings.ENV,
        database=database_status,
        redis=redis_status,
    )
