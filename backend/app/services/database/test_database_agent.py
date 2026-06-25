import asyncio

from app.db.session import SessionLocal

from app.services.database.database_agent import (
    database_agent,
)

db = SessionLocal()


async def main():

    result = await database_agent.answer(
        db=db,
        question="How many users are registered?",
    )

    print()

    print("Generated SQL")

    print(result["sql"])

    print()

    print("Rows")

    print(result["rows"])


asyncio.run(main())