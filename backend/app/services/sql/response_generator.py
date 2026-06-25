from app.services.llm.openrouter_provider import OpenRouterProvider
from app.services.llm.prompt_builder import (
    build_sql_response_prompt,
)

provider = OpenRouterProvider()


class SQLResponseGenerator:

    async def generate(
        self,
        question: str,
        sql: str,
        rows: list[dict],
    ) -> str:

        prompt = build_sql_response_prompt(
            question=question,
            sql=sql,
            rows=rows,
        )

        return await provider.generate(prompt)


sql_response_generator = SQLResponseGenerator()