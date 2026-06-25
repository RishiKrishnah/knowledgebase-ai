import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.knowledge_base import KnowledgeBase
    from app.models.message import Message


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    # ==========================
    # Primary Key
    # ==========================

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ==========================
    # Foreign Keys
    # ==========================

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    knowledge_base_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("knowledge_bases.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ==========================
    # Chat Info
    # ==========================

    title: Mapped[str] = mapped_column(
        String(255),
        default="New Chat",
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

    # ==========================
    # Relationships
    # ==========================

    user: Mapped["User"] = relationship(
        back_populates="chat_sessions",
    )

    knowledge_base: Mapped["KnowledgeBase"] = relationship(
        back_populates="chat_sessions",
    )

    messages: Mapped[list["Message"]] = relationship(
        back_populates="session",
        cascade="all, delete-orphan",
    )

    # ==========================
    # Representation
    # ==========================

    def __repr__(self) -> str:
        return (
            f"<ChatSession("
            f"id={self.id}, "
            f"title='{self.title}'"
            f")>"
        )