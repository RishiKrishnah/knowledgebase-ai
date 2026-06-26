from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.chat_schema import ChatRequest

from app.services.router.intent_router import classify
from app.services.router.intent_router import Intent

from app.services.chat.chat_service import ask as chat_answer
from app.services.llm.rag_service import ask as rag_answer

from app.services.database.database_agent import (
    database_agent,
)

from app.services.sql.response_generator import (
    sql_response_generator,
)

from app.services.conversation.conversation_service import (
    conversation_service,
)

router = APIRouter()


@router.post("/chat")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
):
    try:
        history = conversation_service.history(
            request.session_id
        )

        intent = await classify(request.question)

        if intent == Intent.CHAT:

            answer = await chat_answer(
                request.question,
                history,
            )

        elif intent == Intent.DOCUMENT:

            answer = await rag_answer(
                request.question,
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

        conversation_service.add_message(
            request.session_id,
            "user",
            request.question,
        )

        conversation_service.add_message(
            request.session_id,
            "assistant",
            answer,
        )

        return {
            "intent": intent.value,
            "answer": answer,
        }
    except Exception as e:

        return {
            "error": str(e)
        }