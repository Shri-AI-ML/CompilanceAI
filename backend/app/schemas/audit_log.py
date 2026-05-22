import uuid
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class AuditLogBase(BaseModel):
    actor: str
    action: str
    resource: str
    ip_address: Optional[str] = None
    status: str
    integrity_hash: str


class AuditLogCreate(AuditLogBase):
    organization_id: Optional[uuid.UUID] = None


class AuditLogResponse(AuditLogBase):
    id: uuid.UUID
    organization_id: Optional[uuid.UUID] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AuditLogListResponse(BaseModel):
    items: List[AuditLogResponse]
    total: int
