from fastapi import APIRouter

from app.schemas.chat_schema import ChatRequest
from app.services.llm.rag_service import ask

router = APIRouter()


@router.post("/chat")
async def chat(request: ChatRequest):

    answer = await ask(
        request.question
    )

    return {
        "answer": answer
    }