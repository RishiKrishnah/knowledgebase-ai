from sqlalchemy.orm import Session

from app.services.database.registry import database_registry
from app.services.database.connector import database_connector
from app.services.database.schema_retriever import retrieve_schema

from app.services.sql.generator import sql_generator
from app.services.sql.validator import sql_validator

from app.services.database.executor import database_executor


class DatabaseAgent:

    async def answer(
        self,
        db: Session,
        question: str,
    ):

        #
        # Step 1
        #
        try:
            schema = retrieve_schema(question)

            #
            # Step 2
            #

            sql = await sql_generator.generate(
                question=question,
                schema=schema,
            )

            #
            # Step 3
            #

            validated_sql = sql_validator.validate(sql)

            #
            # Step 4
            #

            connection = database_registry.list_connections(db)[0]

            engine = database_connector.connect(connection)

            #
            # Step 5
            #

            rows = database_executor.execute(
                engine,
                validated_sql,
            )

            return {
                "sql": validated_sql,
                "rows": rows,
            }
        except Exception as e:

            raise RuntimeError(
                f"DatabaseAgent failed: {e}"
            )

database_agent = DatabaseAgent()