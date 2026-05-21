from pydantic import BaseModel


class HealthCheck(BaseModel):
    status: str
    version: str
    environment: str
    database: str
    redis: str
