import json
import sys
from typing import Any, Dict, List, Union
from pydantic import field_validator, ValidationError
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

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if not v or not isinstance(v, str):
            raise ValueError("DATABASE_URL must be a non-empty string.")
        # Ensure it has a valid postgresql prefix
        if not (v.startswith("postgresql://") or v.startswith("postgresql+asyncpg://")):
            raise ValueError("DATABASE_URL must start with 'postgresql://' or 'postgresql+asyncpg://'.")
        # Safe rewrite from postgresql:// to postgresql+asyncpg://
        if v.startswith("postgresql://"):
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v

    # Redis Configuration
    REDIS_URL: str = "redis://localhost:6379/0"

    @field_validator("REDIS_URL")
    @classmethod
    def validate_redis_url(cls, v: str) -> str:
        if not v or not isinstance(v, str):
            raise ValueError("REDIS_URL must be a non-empty string.")
        if not (v.startswith("redis://") or v.startswith("rediss://")):
            raise ValueError("REDIS_URL must start with 'redis://' or 'rediss://'.")
        return v

    # Vector Database Configuration (Qdrant)
    QDRANT_HOST: str = "localhost"
    QDRANT_PORT: int = 6333

    @field_validator("QDRANT_HOST")
    @classmethod
    def validate_qdrant_host(cls, v: str) -> str:
        if not v or not isinstance(v, str) or not v.strip():
            raise ValueError("QDRANT_HOST must be a non-empty string.")
        return v.strip()

    @field_validator("QDRANT_PORT")
    @classmethod
    def validate_qdrant_port(cls, v: int) -> int:
        if not (1 <= v <= 65535):
            raise ValueError("QDRANT_PORT must be a valid port number between 1 and 65535.")
        return v

    # External APIs
    OPENROUTER_API_KEY: str = ""
    CLERK_SECRET_KEY: str = ""

    @field_validator("OPENROUTER_API_KEY")
    @classmethod
    def validate_openrouter_key(cls, v: str, info) -> str:
        # info.data contains attributes parsed so far
        env = info.data.get("ENV", "development")
        if not v or not v.strip():
            raise ValueError("OPENROUTER_API_KEY is required and cannot be empty.")
        if env not in ("development", "test"):
            # Check for common mock strings
            v_lower = v.lower()
            if "mock" in v_lower or "test" in v_lower or "your-" in v_lower:
                raise ValueError("OPENROUTER_API_KEY contains a placeholder/mock value, which is not permitted in production.")
        return v.strip()

    @field_validator("CLERK_SECRET_KEY")
    @classmethod
    def validate_clerk_key(cls, v: str, info) -> str:
        env = info.data.get("ENV", "development")
        if not v or not v.strip():
            raise ValueError("CLERK_SECRET_KEY is required and cannot be empty.")
        if env not in ("development", "test"):
            v_lower = v.lower()
            if "mock" in v_lower or "test" in v_lower or "your-" in v_lower:
                raise ValueError("CLERK_SECRET_KEY contains a placeholder/mock value, which is not permitted in production.")
        return v.strip()

    # Security Configuration
    SECRET_KEY: str = "temporary-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


try:
    settings = Settings()
except ValidationError as e:
    print("\n=======================================================", file=sys.stderr)
    print("FATAL CONFIGURATION ERROR: Environment validation failed!", file=sys.stderr)
    print("=======================================================", file=sys.stderr)
    for err in e.errors():
        # Get field name
        field_name = " -> ".join(str(x) for x in err["loc"])
        # Format clean, helpful error without logging actual input values to avoid leaking secrets
        print(f"Variable: {field_name}", file=sys.stderr)
        print(f"Reason:   {err['msg']}", file=sys.stderr)
        print("-------------------------------------------------------", file=sys.stderr)
    print("Startup aborted due to environment validation errors.", file=sys.stderr)
    print("=======================================================\n", file=sys.stderr)
    sys.exit(1)

