import asyncio

from app.services.sql.generator import sql_generator

schema = """
Table: users

Columns:
- id (UUID)
- email (VARCHAR)
- role (VARCHAR)
"""

question = "How many users are there?"

async def main():

    sql = await sql_generator.generate(
        question=question,
        schema=schema,
    )

    print(sql)

asyncio.run(main())