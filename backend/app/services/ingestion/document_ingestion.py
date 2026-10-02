import os
import uuid
from pathlib import Path

from qdrant_client.models import PointStruct

from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.chunk import Chunk

from app.services.embeddings.bge_embedding import (
    get_embedding,
)

from app.services.ingestion.chunker import (
    chunk_text,
)

from app.services.ingestion.document_parser import (
    extract_text,
)

from app.services.retrieval.client import (
    get_qdrant_client,
)


COLLECTION_NAME = "knowledge_chunks"


def ingest_document(
    db: Session,
    file_path: str,
    filename: str,
    file_type: str,
    mime_type: str | None,
    file_size: int,
    knowledge_base_id,
):

    # ------------------------------------------------------
    # Create document record
    # ------------------------------------------------------

    document = Document(
        id=uuid.uuid4(),
        knowledge_base_id=knowledge_base_id,
        filename=filename,
        file_type=file_type,
        mime_type=mime_type,
        file_size=file_size,
        storage_path=None,
        status="processing",
        processing_stage="extracting",
    )

    db.add(document)
    db.flush()

    try:

        # --------------------------------------------------
        # Extract text
        # --------------------------------------------------

        text = extract_text(
            file_path=file_path,
            file_extension=file_type,
        )

        if not text.strip():
            raise ValueError(
                "No readable text was found in the document."
            )

        document.processing_stage = "chunking"

        # --------------------------------------------------
        # Chunk document
        # --------------------------------------------------

        chunks = chunk_text(text)

        if not chunks:
            raise ValueError(
                "Document produced no chunks."
            )

        document.processing_stage = "embedding"

        qdrant = get_qdrant_client()

        points = []
        chunk_records = []

        # --------------------------------------------------
        # Generate embeddings
        # --------------------------------------------------

        for index, chunk_text_value in enumerate(chunks):

            embedding = get_embedding(
                chunk_text_value
            )

            point_id = str(uuid.uuid4())

            point = PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "text": chunk_text_value,
                    "document_id": str(document.id),
                    "knowledge_base_id": str(
                        knowledge_base_id
                    ),
                    "filename": filename,
                    "chunk_index": index,
                },
            )

            points.append(point)

            chunk_record = Chunk(
                id=uuid.uuid4(),
                document_id=document.id,
                qdrant_point_id=point_id,
                chunk_index=index,
                token_count=None,
                metadata_json=None,
                text=chunk_text_value,
            )

            chunk_records.append(
                chunk_record
            )

        # --------------------------------------------------
        # Insert vectors into Qdrant
        # --------------------------------------------------

        document.processing_stage = "storing"

        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
        )

        # --------------------------------------------------
        # Store chunk metadata in PostgreSQL
        # --------------------------------------------------

        for chunk_record in chunk_records:

            db.add(chunk_record)

        document.status = "ready"
        document.processing_stage = "completed"

        db.commit()

        db.refresh(document)

        return {
            "document_id": str(document.id),
            "filename": document.filename,
            "chunks": len(chunks),
            "status": document.status,
        }

    except Exception:

        db.rollback()

        # Start a fresh transaction to record failure.

        try:

            failed_document = (
                db.query(Document)
                .filter(
                    Document.id == document.id
                )
                .first()
            )

            if failed_document:

                failed_document.status = "failed"
                failed_document.processing_stage = (
                    "failed"
                )

                db.commit()

        except Exception:

            db.rollback()

        raise

    finally:

        try:

            os.remove(file_path)

        except OSError:

            pass