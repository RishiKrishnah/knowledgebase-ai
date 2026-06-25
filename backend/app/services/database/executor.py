from sqlalchemy import text
from sqlalchemy.engine import Engine


class DatabaseExecutor:

    def execute(
        self,
        engine: Engine,
        sql: str,
    ) -> list[dict]:

        with engine.connect() as connection:

            result = connection.execute(text(sql))

            if result.returns_rows:
                return [
                    dict(row._mapping)
                    for row in result
                ]

            return []


database_executor = DatabaseExecutor()