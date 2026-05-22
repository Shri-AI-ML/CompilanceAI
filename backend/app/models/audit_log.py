import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, String, Uuid, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional, TYPE_CHECKING

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.organization import Organization


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid.uuid4)
    
    # Indexed Organization ID
    organization_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, 
        ForeignKey("organizations.id", ondelete="SET NULL"), 
        nullable=True,
        index=True
    )
    
    actor: Mapped[str] = mapped_column(String(255), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    resource: Mapped[str] = mapped_column(String(255), nullable=False)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45), nullable=True)
    status: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., Verified, Warning, Denied
    integrity_hash: Mapped[str] = mapped_column(String(255), nullable=False)  # SHA-256 hash
    
    # Indexed Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
        index=True
    )

    # Relationships
    organization: Mapped[Optional["Organization"]] = relationship("Organization")
