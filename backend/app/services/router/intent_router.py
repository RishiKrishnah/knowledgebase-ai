from enum import Enum

from app.services.llm.openrouter_provider import OpenRouterProvider


class Intent(str, Enum):
    CHAT = "CHAT"
    DOCUMENT = "DOCUMENT"
    DATABASE = "DATABASE"


provider = OpenRouterProvider()


SYSTEM_PROMPT = """
DOCUMENT
The answer should come from uploaded documents,
knowledge bases,
PDFs,
Excel,
Word,
CSV,
TXT files,
school policies,
company policies,
manuals,
rules,
documentation,
or other uploaded knowledge.

Choose DOCUMENT when the user asks about information
that could reasonably be contained in an uploaded document,
even if the user does not explicitly mention the document.

Examples:

What is the minimum attendance requirement?
DOCUMENT

What are the school timings?
DOCUMENT

What documents are required for admission?
DOCUMENT

What is the leave policy?
DOCUMENT

What are the rules for using school computers?
DOCUMENT

How do I apply for admission?
DOCUMENT

What is the transport policy?
DOCUMENT

What is the examination policy?
DOCUMENT
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