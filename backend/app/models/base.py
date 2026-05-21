# Import all models here so Alembic can discover them
# pyrefly: ignore [unused-import]
from app.core.database import Base  # pyrefly: ignore [unused-import]

# We can also add default shared mixins or fields (e.g. ID, created_at, updated_at) here.
from datetime import datetime
# pyrefly: ignore [missing-import]
from sqlalchemy import DateTime
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Mapped, mapped_column


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )
