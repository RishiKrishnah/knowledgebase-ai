from uuid import UUID

from sqlalchemy.orm import Session

from app.models.database_connection import DatabaseConnection
from app.repositories.database_connection_repository import (
    DatabaseConnectionRepository,
)


class DatabaseRegistryService:

    def __init__(self):

        self.repository = DatabaseConnectionRepository()

    def create_connection(
        self,
        db: Session,
        *,
        name: str,
        db_type: str,
        host: str,
        port: int,
        database_name: str,
        username: str,
        password: str,
    ) -> DatabaseConnection:

        connection = DatabaseConnection(
            name=name,
            db_type=db_type,
            host=host,
            port=port,
            database_name=database_name,
            username=username,
            password=password,
        )

        return self.repository.create(
            db,
            connection,
        )

    def get_connection(
        self,
        db: Session,
        connection_id: UUID,
    ) -> DatabaseConnection | None:

        return self.repository.get(
            db,
            connection_id,
        )

    def list_connections(
        self,
        db: Session,
    ) -> list[DatabaseConnection]:

        return self.repository.list(db)

    def update_connection(
        self,
        db: Session,
        connection: DatabaseConnection,
    ) -> DatabaseConnection:

        return self.repository.update(
            db,
            connection,
        )

    def delete_connection(
        self,
        db: Session,
        connection: DatabaseConnection,
    ):

        self.repository.delete(
            db,
            connection,
        )


database_registry = DatabaseRegistryService()