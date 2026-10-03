from datetime import datetime

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.routes.sessions import get_demo_context
from app.db.session import get_db
from app.models.chat_session import ChatSession
from app.models.database_connection import DatabaseConnection
from app.models.document import Document
from app.models.knowledge_base import KnowledgeBase


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


# ============================================================
# RESPONSE SCHEMAS
# ============================================================


class DashboardStats(BaseModel):
    knowledge_bases: int
    documents: int
    database_connections: int
    chats: int


class DashboardActivity(BaseModel):
    type: str
    title: str
    description: str
    created_at: datetime


class DashboardSummaryResponse(BaseModel):
    stats: DashboardStats
    recent_activity: list[DashboardActivity]


# ============================================================
# DASHBOARD SUMMARY
# ============================================================


@router.get(
    "/summary",
    response_model=DashboardSummaryResponse,
)
def get_dashboard_summary(
    db: Session = Depends(get_db),
):
    """
    Return real dashboard statistics and recent activity.

    The current application uses a shared demo user through
    get_demo_context(), so dashboard data follows the same
    ownership rules as the existing knowledge-base and
    session APIs.
    """

    user, _ = get_demo_context(db)

    # ========================================================
    # KNOWLEDGE BASE COUNT
    # ========================================================

    knowledge_base_count = (
        db.query(
            func.count(KnowledgeBase.id)
        )
        .filter(
            KnowledgeBase.owner_id == user.id
        )
        .scalar()
        or 0
    )

    # ========================================================
    # DOCUMENT COUNT
    #
    # IMPORTANT:
    # /documents without a knowledge_base_id intentionally
    # returns documents from the Default Knowledge Base.
    #
    # The dashboard needs the TOTAL across every KB, so we
    # query documents directly and join KnowledgeBase.
    # ========================================================

    document_count = (
        db.query(
            func.count(Document.id)
        )
        .join(
            KnowledgeBase,
            Document.knowledge_base_id
            == KnowledgeBase.id,
        )
        .filter(
            KnowledgeBase.owner_id == user.id
        )
        .scalar()
        or 0
    )

    # ========================================================
    # DATABASE CONNECTION COUNT
    #
    # DatabaseConnection currently has no owner_id.
    # Therefore this is the total number of connections
    # currently stored by the application.
    # ========================================================

    database_connection_count = (
        db.query(
            func.count(DatabaseConnection.id)
        )
        .scalar()
        or 0
    )

    # ========================================================
    # CHAT COUNT
    #
    # A "chat" in the current system is a ChatSession.
    # ========================================================

    chat_count = (
        db.query(
            func.count(ChatSession.id)
        )
        .filter(
            ChatSession.user_id == user.id
        )
        .scalar()
        or 0
    )

    # ========================================================
    # RECENT DOCUMENTS
    # ========================================================

    recent_documents = (
        db.query(Document)
        .join(
            KnowledgeBase,
            Document.knowledge_base_id
            == KnowledgeBase.id,
        )
        .filter(
            KnowledgeBase.owner_id == user.id
        )
        .order_by(
            Document.created_at.desc()
        )
        .limit(5)
        .all()
    )

    # ========================================================
    # RECENT KNOWLEDGE BASES
    # ========================================================

    recent_knowledge_bases = (
        db.query(KnowledgeBase)
        .filter(
            KnowledgeBase.owner_id == user.id
        )
        .order_by(
            KnowledgeBase.created_at.desc()
        )
        .limit(5)
        .all()
    )

    # ========================================================
    # RECENT CHATS
    # ========================================================

    recent_chats = (
        db.query(ChatSession)
        .filter(
            ChatSession.user_id == user.id
        )
        .order_by(
            ChatSession.created_at.desc()
        )
        .limit(5)
        .all()
    )

    # ========================================================
    # RECENT DATABASE CONNECTIONS
    # ========================================================

    recent_connections = (
        db.query(DatabaseConnection)
        .order_by(
            DatabaseConnection.created_at.desc()
        )
        .limit(5)
        .all()
    )

    # ========================================================
    # COMBINE ACTIVITY
    # ========================================================

    activities: list[DashboardActivity] = []

    for document in recent_documents:
        activities.append(
            DashboardActivity(
                type="document",
                title="Document uploaded",
                description=document.filename,
                created_at=document.created_at,
            )
        )

    for knowledge_base in recent_knowledge_bases:
        activities.append(
            DashboardActivity(
                type="knowledge_base",
                title="Knowledge base created",
                description=knowledge_base.name,
                created_at=knowledge_base.created_at,
            )
        )

    for chat in recent_chats:
        activities.append(
            DashboardActivity(
                type="chat",
                title="AI chat started",
                description=chat.title,
                created_at=chat.created_at,
            )
        )

    for connection in recent_connections:
        activities.append(
            DashboardActivity(
                type="database",
                title="Database connection created",
                description=connection.name,
                created_at=connection.created_at,
            )
        )

    # ========================================================
    # NEWEST FIRST
    # ========================================================

    activities.sort(
        key=lambda activity: activity.created_at,
        reverse=True,
    )

    # Keep dashboard activity compact.
    activities = activities[:8]

    # ========================================================
    # RESPONSE
    # ========================================================

    return DashboardSummaryResponse(
        stats=DashboardStats(
            knowledge_bases=knowledge_base_count,
            documents=document_count,
            database_connections=database_connection_count,
            chats=chat_count,
        ),
        recent_activity=activities,
    )