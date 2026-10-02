from pydantic import BaseModel


class DocumentUploadResponse(BaseModel):

    document_id: str

    filename: str

    chunks: int

    status: str