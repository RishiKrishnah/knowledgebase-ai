from app.services.retrieval.search import search
from app.services.llm.prompt_builder import build_prompt
from app.services.llm.openrouter_provider import OpenRouterProvider


provider = OpenRouterProvider()


async def ask(question: str):

    hits = search(question)

    contexts = [
        hit.payload["text"]
        for hit in hits
    ]

    prompt = build_prompt(
        question,
        contexts
    )

    answer = await provider.generate(prompt)

    return answer