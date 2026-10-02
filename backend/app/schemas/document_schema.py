from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):
    id: UUID
    filename: str
    file_type: str
    mime_type: str | None
    file_size: int
    status: str
    processing_stage: str
    created_at: datetime

    class Config:
        from_attributes = True


class DocumentListItem(BaseModel):
    id: UUID
    filename: str
    file_type: str
    mime_type: str | None
    file_size: int
    status: str
    processing_stage: str
    created_at: datetime

    class Config:
        from_attributes = True