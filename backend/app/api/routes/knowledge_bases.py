from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.routes.sessions import get_demo_context
from app.db.session import get_db
from app.models.knowledge_base import KnowledgeBase
from app.schemas.knowledge_base import (
    KnowledgeBaseCreate,
    KnowledgeBaseResponse,
    KnowledgeBaseUpdate,
)


router = APIRouter(
    prefix="/knowledge-bases",
    tags=["Knowledge Bases"],
)


def serialize_knowledge_base(
    knowledge_base: KnowledgeBase,
) -> KnowledgeBaseResponse:
    return KnowledgeBaseResponse(
        id=knowledge_base.id,
        name=knowledge_base.name,
        description=knowledge_base.description,
        created_at=knowledge_base.created_at,
        document_count=len(knowledge_base.documents),
    )


@router.get(
    "",
    response_model=list[KnowledgeBaseResponse],
)
def list_knowledge_bases(
    db: Session = Depends(get_db),
):
    user, _ = get_demo_context(db)

    knowledge_bases = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.owner_id == user.id
        )
        .order_by(
            KnowledgeBase.created_at.desc()
        )
        .all()
    )

    return [
        serialize_knowledge_base(kb)
        for kb in knowledge_bases
    ]


@router.get(
    "/{knowledge_base_id}",
    response_model=KnowledgeBaseResponse,
)
def get_knowledge_base(
    knowledge_base_id: UUID,
    db: Session = Depends(get_db),
):
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

    return serialize_knowledge_base(
        knowledge_base
    )


@router.post(
    "",
    response_model=KnowledgeBaseResponse,
    status_code=201,
)
def create_knowledge_base(
    request: KnowledgeBaseCreate,
    db: Session = Depends(get_db),
):
    user, _ = get_demo_context(db)

    name = request.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Knowledge base name is required.",
        )

    existing = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.owner_id == user.id,
            KnowledgeBase.name == name,
        )
        .first()
    )

    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail="A knowledge base with this name already exists.",
        )

    knowledge_base = KnowledgeBase(
        id=uuid4(),
        name=name,
        description=(
            request.description.strip()
            if request.description
            else None
        ),
        owner_id=user.id,
    )

    db.add(knowledge_base)
    db.commit()
    db.refresh(knowledge_base)

    return serialize_knowledge_base(
        knowledge_base
    )


@router.patch(
    "/{knowledge_base_id}",
    response_model=KnowledgeBaseResponse,
)
def update_knowledge_base(
    knowledge_base_id: UUID,
    request: KnowledgeBaseUpdate,
    db: Session = Depends(get_db),
):
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

    if request.name is not None:
        name = request.name.strip()

        if not name:
            raise HTTPException(
                status_code=400,
                detail="Knowledge base name is required.",
            )

        duplicate = (
            db.query(KnowledgeBase)
            .filter(
                KnowledgeBase.owner_id == user.id,
                KnowledgeBase.name == name,
                KnowledgeBase.id != knowledge_base_id,
            )
            .first()
        )

        if duplicate is not None:
            raise HTTPException(
                status_code=409,
                detail="A knowledge base with this name already exists.",
            )

        knowledge_base.name = name

    if request.description is not None:
        knowledge_base.description = (
            request.description.strip()
            or None
        )

    db.commit()
    db.refresh(knowledge_base)

    return serialize_knowledge_base(
        knowledge_base
    )


@router.delete(
    "/{knowledge_base_id}",
)
def delete_knowledge_base(
    knowledge_base_id: UUID,
    db: Session = Depends(get_db),
):
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

    # Do not allow deletion of the default KB.
    if knowledge_base.name == "Default Knowledge Base":
        raise HTTPException(
            status_code=400,
            detail="The default knowledge base cannot be deleted.",
        )

    db.delete(knowledge_base)
    db.commit()

    return {
        "id": str(knowledge_base_id),
        "status": "deleted",
    }