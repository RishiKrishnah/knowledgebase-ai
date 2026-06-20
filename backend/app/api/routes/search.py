from fastapi import APIRouter

from app.schemas.question_schema import QuestionRequest
from app.services.retrieval.search import search

router = APIRouter()


@router.post("/search")
def semantic_search(request: QuestionRequest):

    hits = search(request.question)

    results = []

    for hit in hits:
        results.append({
            "score": hit.score,
            "text": hit.payload["text"]
        })

    return results