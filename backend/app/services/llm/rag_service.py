from app.services.retrieval.search import search
from app.services.llm.prompt_builder import build_rag_prompt
from app.services.llm.openrouter_provider import (
    OpenRouterProvider,
)


provider = OpenRouterProvider()


async def ask(
    question: str,
    knowledge_base_id: str | None = None,
):

    hits = search(
        query=question,
        knowledge_base_id=knowledge_base_id,
    )

    contexts = [
        hit.payload["text"]
        for hit in hits
        if hit.payload
        and hit.payload.get("text")
    ]

    if not contexts:

        return (
            "I couldn't find relevant information "
            "in the uploaded documents."
        )

    prompt = build_rag_prompt(
        question,
        contexts,
    )

    answer = await provider.generate(
        prompt
    )

    return answer