from pydantic import BaseModel
from typing import Dict


class HealthCheck(BaseModel):
    status: str
    version: str
    environment: str
    database: str
    redis: str
    qdrant: str
    services: Dict[str, str]

