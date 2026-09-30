from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class SessionCreate(BaseModel):
    title: str = "New Chat"


class SessionResponse(BaseModel):
    id: UUID
    title: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }