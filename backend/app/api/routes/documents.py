import uuid
from pathlib import Path
from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
)
from sqlalchemy.orm import Session

from qdrant_client.models import PointIdsList

from app.api.routes.sessions import get_demo_context
from app.core.config import settings
from app.db.session import get_db
from app.models.document import Document
from app.models.knowledge_base import KnowledgeBase
from app.schemas.document_schema import (
    DocumentListItem,
    DocumentUploadResponse,
)
from app.services.ingestion.document_ingestion import (
    ingest_document,
)
from app.services.retrieval.client import (
    get_qdrant_client,
)


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


def get_user_knowledge_base(
    db: Session,
    knowledge_base_id: UUID,
) -> KnowledgeBase:

    user, _ = get_demo_context(db)

    knowledge_base = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.id == knowledge_base_id,
            KnowledgeBase.owner_id == user.id,
        )
        .first()
    )

    if knowledge_base is None:
        raise HTTPException(
            status_code=404,
            detail="Knowledge base not found.",
        )

    return knowledge_base


@router.post(
    "/upload",
    response_model=DocumentUploadResponse,
)
async def upload_document(
    file: UploadFile = File(...),
    knowledge_base_id: UUID | None = Form(
        default=None
    ),
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
    # Resolve knowledge base
    #
    # If knowledge_base_id is supplied:
    #     upload into that knowledge base.
    #
    # If omitted:
    #     preserve existing chat uploader behavior
    #     and use the default knowledge base.
    # ------------------------------------------------------

    if knowledge_base_id is not None:

        knowledge_base = get_user_knowledge_base(
            db=db,
            knowledge_base_id=knowledge_base_id,
        )

    else:

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


@router.get(
    "",
    response_model=list[DocumentListItem],
)
def list_documents(
    knowledge_base_id: UUID | None = None,
    db: Session = Depends(get_db),
):

    user, default_knowledge_base = (
        get_demo_context(db)
    )

    query = (
        db.query(Document)
        .join(
            KnowledgeBase,
            Document.knowledge_base_id
            == KnowledgeBase.id,
        )
        .filter(
            KnowledgeBase.owner_id == user.id
        )
    )

    # ------------------------------------------------------
    # If a KB was supplied, return documents from that KB.
    #
    # Otherwise preserve the old behavior and return
    # documents from the default KB.
    # ------------------------------------------------------

    if knowledge_base_id is not None:

        # Verify that this KB belongs to the user.
        get_user_knowledge_base(
            db=db,
            knowledge_base_id=knowledge_base_id,
        )

        query = query.filter(
            Document.knowledge_base_id
            == knowledge_base_id
        )

    else:

        query = query.filter(
            Document.knowledge_base_id
            == default_knowledge_base.id
        )

    documents = (
        query
        .order_by(
            Document.created_at.desc()
        )
        .all()
    )

    return documents


@router.delete("/{document_id}")
def delete_document(
    document_id: UUID,
    db: Session = Depends(get_db),
):

    user, _ = get_demo_context(db)

    # ------------------------------------------------------
    # Only allow deletion of documents belonging to the
    # current user's knowledge bases.
    # ------------------------------------------------------

    document = (
        db.query(Document)
        .join(
            KnowledgeBase,
            Document.knowledge_base_id
            == KnowledgeBase.id,
        )
        .filter(
            Document.id == document_id,
            KnowledgeBase.owner_id == user.id,
        )
        .first()
    )

    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found.",
        )

    try:

        # --------------------------------------------------
        # Get Qdrant point IDs belonging to this document.
        # --------------------------------------------------

        qdrant_point_ids = [
            chunk.qdrant_point_id
            for chunk in document.chunks
            if chunk.qdrant_point_id
        ]

        # --------------------------------------------------
        # Delete vectors from Qdrant.
        # --------------------------------------------------

        if qdrant_point_ids:

            qdrant = get_qdrant_client()

            qdrant.delete(
                collection_name="knowledge_chunks",
                points_selector=PointIdsList(
                    points=qdrant_point_ids
                ),
            )

        # --------------------------------------------------
        # Delete stored file if present.
        # --------------------------------------------------

        if document.storage_path:

            stored_file = Path(
                document.storage_path
            )

            if stored_file.exists():
                stored_file.unlink()

        # --------------------------------------------------
        # Delete PostgreSQL document.
        #
        # Existing SQLAlchemy cascade handles chunks.
        # --------------------------------------------------

        db.delete(document)
        db.commit()

        return {
            "document_id": str(document_id),
            "status": "deleted",
        }

    except Exception as exc:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=(
                f"Document deletion failed: {exc}"
            ),
        )