from enum import Enum

from app.services.llm.openrouter_provider import OpenRouterProvider


class Intent(str, Enum):
    CHAT = "CHAT"
    DOCUMENT = "DOCUMENT"
    DATABASE = "DATABASE"


provider = OpenRouterProvider()


SYSTEM_PROMPT = """
You are an intent classifier.

Your job is ONLY to classify the user's request.

Return ONLY one word.

CHAT
DOCUMENT
DATABASE

Definitions:

CHAT
General conversation.
No document lookup.
No SQL needed.

DOCUMENT
The answer should come from uploaded documents,
knowledge bases,
PDFs,
Excel,
Word,
CSV,
etc.

DATABASE
The user is asking about structured data.

Examples:

How many students attended yesterday?
DATABASE

List all pending invoices.
DATABASE

What is Artificial Intelligence?
CHAT

Explain Newton's Second Law from the uploaded notes.
DOCUMENT

Who are you?
CHAT

Return ONLY:

CHAT

or

DOCUMENT

or

DATABASE
"""


async def classify(question: str) -> Intent:

    prompt = f"""
{SYSTEM_PROMPT}

Question:

{question}
"""

    response = await provider.generate(prompt)

    response = response.strip().upper()

    if response == "DATABASE":
        return Intent.DATABASE

    if response == "DOCUMENT":
        return Intent.DOCUMENT

    return Intent.CHAT