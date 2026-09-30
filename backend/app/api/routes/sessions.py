from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.models.chat_session import ChatSession
from app.models.knowledge_base import KnowledgeBase
from app.models.message import Message
from app.models.user import User

from app.schemas.session_schema import (
    MessageResponse,
    SessionCreate,
    SessionResponse,
)


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


def get_demo_context(db: Session):
    """
    Temporary anonymous/demo context.

    This provides one shared demo user until
    real authentication/JWT user handling is
    implemented.
    """

    user = (
        db.query(User)
        .filter(
            User.email
            == "demo@knowledgebase.local"
        )
        .first()
    )

    if user is None:
        user = User(
            id=uuid4(),
            email="demo@knowledgebase.local",
            password_hash="not-used",
            role="user",
        )

        db.add(user)
        db.flush()

    knowledge_base = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.owner_id
            == user.id,
            KnowledgeBase.name
            == "Default Knowledge Base",
        )
        .first()
    )

    if knowledge_base is None:
        knowledge_base = KnowledgeBase(
            id=uuid4(),
            name="Default Knowledge Base",
            description="Default knowledge base",
            owner_id=user.id,
        )

        db.add(knowledge_base)
        db.flush()

    if (
        user.id
        and knowledge_base.id
    ):
        db.commit()

    return user, knowledge_base


@router.post(
    "",
    response_model=SessionResponse,
)
def create_session(
    request: SessionCreate,
    db: Session = Depends(get_db),
):
    user, knowledge_base = (
        get_demo_context(db)
    )

    session = ChatSession(
        id=uuid4(),

        user_id=user.id,

        knowledge_base_id=
            knowledge_base.id,

        title=(
            request.title.strip()
            or "New Chat"
        ),
    )

    db.add(session)

    db.commit()

    db.refresh(session)

    return session


@router.get(
    "",
    response_model=list[SessionResponse],
)
def list_sessions(
    db: Session = Depends(get_db),
):
    user, _ = get_demo_context(db)

    return (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id
            == user.id
        )
        .order_by(
            ChatSession.created_at.desc()
        )
        .all()
    )


@router.get(
    "/{session_id}/messages",
    response_model=list[MessageResponse],
)
def list_messages(
    session_id: UUID,
    db: Session = Depends(get_db),
):
    user, _ = get_demo_context(db)

    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id
            == session_id,

            ChatSession.user_id
            == user.id,
        )
        .first()
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Session not found",
        )

    return (
        db.query(Message)
        .filter(
            Message.session_id
            == session.id
        )
        .order_by(
            Message.created_at.asc()
        )
        .all()
    )