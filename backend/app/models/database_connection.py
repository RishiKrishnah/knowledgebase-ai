import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DatabaseConnection(Base):
    __tablename__ = "database_connections"

    # ==========================
    # Primary Key
    # ==========================

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ==========================
    # Connection Information
    # ==========================

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    db_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="postgresql",
    )

    host: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    port: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    database_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    username: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ==========================
    # Timestamp
    # ==========================

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    def __repr__(self):

        return (
            f"<DatabaseConnection("
            f"name='{self.name}', "
            f"type='{self.db_type}', "
            f"database='{self.database_name}'"
            f")>"
        )