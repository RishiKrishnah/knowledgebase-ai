from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.models.database_connection import DatabaseConnection


class DatabaseConnector:

    def connect(
        self,
        connection: DatabaseConnection,
    ) -> Engine:

        if connection.db_type == "postgresql":

            url = (
                f"postgresql://"
                f"{connection.username}:"
                f"{connection.password}"
                f"@{connection.host}:"
                f"{connection.port}/"
                f"{connection.database_name}"
            )

        else:
            raise ValueError(
                f"Unsupported database type: {connection.db_type}"
            )

        engine = create_engine(
            url,
            pool_pre_ping=True,
            future=True,
        )

        return engine


database_connector = DatabaseConnector()