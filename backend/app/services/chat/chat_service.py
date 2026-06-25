from app.services.llm.openrouter_provider import OpenRouterProvider

provider = OpenRouterProvider()


async def ask(question: str, history: list):

    messages = history.copy()

    messages.append(
        {
            "role": "user",
            "content": question,
        }
    )

    return await provider.generate_messages(messages)