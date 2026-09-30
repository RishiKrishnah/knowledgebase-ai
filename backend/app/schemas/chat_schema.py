from uuid import UUID

from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: UUID
    question: str