from fastapi import APIRouter
from app.api.v1.endpoints import health, users, organizations, audit_logs

api_router = APIRouter()

# Register sub-routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(audit_logs.router, prefix="/audit-logs", tags=["audit-logs"])


