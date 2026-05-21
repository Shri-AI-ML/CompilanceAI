import json
from typing import Any, Dict, List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "ComplianceOS AI API"
    API_V1_STR: str = "/api/v1"
    ENV: str = "development"

    # CORS Origins - loaded as a JSON array or list of strings
    BACKEND_CORS_ORIGINS: List[str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v

    # Database Configuration (PostgreSQL Async)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/complianceos"

    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"

    # Vector Database Configuration (Qdrant)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    # External APIs
    OPENROUTER_API_KEY: str = ""
    CLERK_SECRET_KEY: str = ""

    # Security Configuration
    SECRET_KEY: str = "temporary-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()
