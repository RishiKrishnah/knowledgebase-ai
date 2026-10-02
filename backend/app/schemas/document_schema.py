from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DocumentUploadResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    mime_type: str | None
    file_size: int
    status: str
    processing_stage: str
    created_at: datetime

    # Number of chunks generated during ingestion.
    # This keeps the existing chat uploader working.
    chunks: int = 0

    model_config = ConfigDict(
        from_attributes=True
    )


class DocumentListItem(BaseModel):
    id: UUID
    filename: str
    file_type: str
    mime_type: str | None
    file_size: int
    status: str
    processing_stage: str
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )