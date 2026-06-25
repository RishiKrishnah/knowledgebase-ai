from app.services.llm.openrouter_provider import OpenRouterProvider
from app.services.llm.prompt_builder import build_sql_prompt

provider = OpenRouterProvider()

class SQLGenerator:

    async def generate(
        self,
        question: str,
        schema: str,
    ) -> str:

        prompt = build_sql_prompt(
            question=question,
            schema=schema,
        )

        sql = await provider.generate(prompt)

        return sql.strip()


sql_generator = SQLGenerator()