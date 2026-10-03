from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.routes.sessions import get_demo_context
from app.db.session import get_db
from app.models.knowledge_base import KnowledgeBase
from app.schemas.question_schema import QuestionRequest
from app.services.retrieval.search import search


router = APIRouter(
    tags=["Semantic Search"],
)


@router.post("/search")
def semantic_search(
    request: QuestionRequest,
    knowledge_base_id: UUID | None = None,
    db: Session = Depends(get_db),
):
    """
    Perform semantic search.

    If knowledge_base_id is supplied, only chunks belonging
    to that knowledge base are searched.

    If it is omitted, the existing default knowledge base
    is used for backward compatibility.
    """

    user, default_knowledge_base = (
        get_demo_context(db)
    )

    # ------------------------------------------------------
    # Resolve knowledge base
    # ------------------------------------------------------

    if knowledge_base_id is not None:

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

    else:

        knowledge_base = default_knowledge_base

    # ------------------------------------------------------
    # Perform vector search
    # ------------------------------------------------------

    hits = search(
        query=request.question,
        knowledge_base_id=str(
            knowledge_base.id
        ),
    )

    # ------------------------------------------------------
    # Build response
    # ------------------------------------------------------

    results = []

    for hit in hits:

        payload = hit.payload or {}

        results.append(
            {
                "score": hit.score,
                "text": payload.get(
                    "text",
                    "",
                ),
                "document_id": payload.get(
                    "document_id"
                ),
                "filename": payload.get(
                    "filename"
                ),
                "chunk_index": payload.get(
                    "chunk_index"
                ),
                "knowledge_base_id": payload.get(
                    "knowledge_base_id"
                ),
            }
        )

    return {
        "knowledge_base_id": str(
            knowledge_base.id
        ),
        "knowledge_base_name": (
            knowledge_base.name
        ),
        "results": results,
    }