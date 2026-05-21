from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="ComplianceOS AI API - Enterprise AI-Native Compliance Platform",
    version="0.1.0",
)

# Set up CORS middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
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
