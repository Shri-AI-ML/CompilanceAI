import asyncio
import logging
from urllib.parse import urlparse
from fastapi import APIRouter, Depends, Response, status
# pyrefly: ignore [missing-import]
from sqlalchemy import text
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession

from app.api import deps
from app.core.config import settings
from app.schemas.health import HealthCheck

logger = logging.getLogger(__name__)
router = APIRouter()


async def check_tcp_connection(host: str, port: int, timeout: float = 1.0) -> bool:
    """Verifies connection to a service via low-level TCP socket without pulling external clients."""
    try:
        # Resolve connection
        reader, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=timeout
        )
        writer.close()
        try:
            await writer.wait_closed()
        except Exception:
            pass
        return True
    except Exception as e:
        logger.debug(f"TCP check to {host}:{port} failed: {e}")
        return False


@router.get("/", response_model=HealthCheck)
async def check_health(response: Response, db: AsyncSession = Depends(deps.get_db)) -> HealthCheck:
    """
    Perform a health check on the API and its backend dependencies.
    """
    # 1. Check Database connection
    database_status = "unhealthy"
    try:
        result = await db.execute(text("SELECT 1"))
        if result.scalar() == 1:
            database_status = "healthy"
    except Exception as e:
        database_status = f"unhealthy: {str(e)}"

    # 2. Check Redis connection (TCP check)
    redis_status = "unhealthy"
    try:
        parsed = urlparse(settings.REDIS_URL)
        host = parsed.hostname or "localhost"
        port = parsed.port or 6379
        if await check_tcp_connection(host, port):
            redis_status = "healthy"
    except Exception as e:
        logger.warning(f"Error parsing or checking Redis: {e}")

    # 3. Check Qdrant connection (TCP check)
    qdrant_status = "unhealthy"
    try:
        if await check_tcp_connection(settings.QDRANT_HOST, settings.QDRANT_PORT):
            qdrant_status = "healthy"
    except Exception as e:
        logger.warning(f"Error checking Qdrant: {e}")

    # Determine overall status
    is_healthy = (
        database_status == "healthy"
        and redis_status == "healthy"
        and qdrant_status == "healthy"
    )
    overall_status = "healthy" if is_healthy else "unhealthy"

    # Set 503 Service Unavailable status code if any check fails
    if not is_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    services_map = {
        "database": database_status,
        "redis": redis_status,
        "qdrant": qdrant_status
    }

    return HealthCheck(
        status=overall_status,
        version="0.1.0",
        environment=settings.ENV,
        database=database_status,
        redis=redis_status,
        qdrant=qdrant_status,
        services=services_map,
    )

