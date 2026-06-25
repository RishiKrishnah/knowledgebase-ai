import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.document import Document


class Chunk(Base):
    __tablename__ = "chunks"

    # ==========================
    # Primary Key
    # ==========================

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ==========================
    # Foreign Key
    # ==========================

    document_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("documents.id", ondelete="CASCADE"),
        nullable=False,
    )

    # ==========================
    # Chunk Metadata
    # ==========================

    qdrant_point_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
    )

    chunk_index: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    token_count: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
    )

    metadata_json: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    # ==========================
    # Chunk Content
    # ==========================

    text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # ==========================
    # Relationship
    # ==========================

    document: Mapped["Document"] = relationship(
        back_populates="chunks",
    )

    # ==========================
    # Representation
    # ==========================

    def __repr__(self) -> str:
        return (
            f"<Chunk("
            f"id={self.id}, "
            f"chunk_index={self.chunk_index}"
            f")>"
        )