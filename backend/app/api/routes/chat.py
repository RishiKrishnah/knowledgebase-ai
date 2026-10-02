from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.chat_session import ChatSession
from app.models.message import Message
from app.schemas.chat_schema import ChatRequest

from app.services.router.intent_router import classify
from app.services.router.intent_router import Intent

from app.services.chat.chat_service import ask as chat_answer
from app.services.llm.rag_service import ask as rag_answer

from app.services.database.database_agent import database_agent

from app.services.sql.response_generator import (
    sql_response_generator,
)


router = APIRouter()


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):

    try:

        # ------------------------------------------------------
        # Find PostgreSQL session
        # ------------------------------------------------------

        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.id == request.session_id
            )
            .first()
        )

        if session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found",
            )

        # ------------------------------------------------------
        # Load conversation history from PostgreSQL
        # ------------------------------------------------------

        previous_messages = (
            db.query(Message)
            .filter(
                Message.session_id == session.id
            )
            .order_by(Message.created_at.desc())
            .limit(10)
            .all()
        )

        previous_messages.reverse()

        history = [
            {
                "role": message.role,
                "content": message.content,
            }
            for message in previous_messages
        ]

        # ------------------------------------------------------
        # Classify question
        # ------------------------------------------------------

        intent = await classify(request.question)

        # ------------------------------------------------------
        # Generate answer
        # ------------------------------------------------------

        if intent == Intent.CHAT:

            answer = await chat_answer(
                request.question,
                history,
            )

        elif intent == Intent.DOCUMENT:

            answer = await rag_answer(
                request.question,
                knowledge_base_id=session.knowledge_base_id,
            )

        else:

            result = await database_agent.answer(
                db=db,
                question=request.question,
            )

            answer = await sql_response_generator.generate(
                question=request.question,
                sql=result["sql"],
                rows=result["rows"],
            )

        # ------------------------------------------------------
        # Save user message
        # ------------------------------------------------------

        user_message = Message(
            id=uuid4(),
            session_id=session.id,
            role="user",
            content=request.question,
        )

        db.add(user_message)

        # ------------------------------------------------------
        # Save assistant message
        # ------------------------------------------------------

        assistant_message = Message(
            id=uuid4(),
            session_id=session.id,
            role="assistant",
            content=answer,
        )

        db.add(assistant_message)

        db.commit()

        # ------------------------------------------------------
        # Return response
        # ------------------------------------------------------

        return {
            "intent": intent.value,
            "answer": answer,
        }

    except HTTPException:
        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )