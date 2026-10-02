import os
import uuid
from pathlib import Path

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    UploadFile,
)

from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.document import Document

from app.api.routes.sessions import (
    get_demo_context,
)

from app.schemas.document_schema import (
    DocumentUploadResponse,
)

from app.services.ingestion.document_ingestion import (
    ingest_document,
)

from app.core.config import settings


router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


ALLOWED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
}


MAX_FILE_SIZE = 20 * 1024 * 1024


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    # ------------------------------------------------------
    # Validate filename
    # ------------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="Filename is required.",
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported file type. "
                "Supported types: "
                "PDF, DOCX, TXT, CSV, XLSX."
            ),
        )

    # ------------------------------------------------------
    # Read uploaded file
    # ------------------------------------------------------

    contents = await file.read()

    if not contents:

        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    if len(contents) > MAX_FILE_SIZE:

        raise HTTPException(
            status_code=413,
            detail=(
                "File is too large. "
                "Maximum size is 20 MB."
            ),
        )

    # ------------------------------------------------------
    # Get current demo user / knowledge base
    # ------------------------------------------------------

    _, knowledge_base = get_demo_context(db)

    # ------------------------------------------------------
    # Ensure temporary upload directory exists
    # ------------------------------------------------------

    upload_directory = Path(
        settings.UPLOAD_DIRECTORY
    )

    upload_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    # ------------------------------------------------------
    # Generate temporary filename
    # ------------------------------------------------------

    temporary_filename = (
        f"{uuid.uuid4()}{extension}"
    )

    temporary_path = (
        upload_directory
        / temporary_filename
    )

    # ------------------------------------------------------
    # Save temporary file
    # ------------------------------------------------------

    try:

        temporary_path.write_bytes(
            contents
        )

        # --------------------------------------------------
        # Run ingestion
        # --------------------------------------------------

        result = ingest_document(
            db=db,
            file_path=str(temporary_path),
            filename=file.filename,
            file_type=extension,
            mime_type=file.content_type,
            file_size=len(contents),
            knowledge_base_id=knowledge_base.id,
        )

        return result

    except ValueError as exc:

        if temporary_path.exists():
            temporary_path.unlink()

        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:

        if temporary_path.exists():
            temporary_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Document ingestion failed: {exc}",
        )