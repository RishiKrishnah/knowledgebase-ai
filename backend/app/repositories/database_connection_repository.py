from uuid import UUID

from sqlalchemy.orm import Session

from app.models.database_connection import DatabaseConnection


class DatabaseConnectionRepository:

    def create(
        self,
        db: Session,
        connection: DatabaseConnection,
    ) -> DatabaseConnection:

        db.add(connection)
        db.commit()
        db.refresh(connection)

        return connection

    def get(
        self,
        db: Session,
        connection_id: UUID,
    ) -> DatabaseConnection | None:

        return (
            db.query(DatabaseConnection)
            .filter(DatabaseConnection.id == connection_id)
            .first()
        )

    def list(
        self,
        db: Session,
    ) -> list[DatabaseConnection]:

        return (
            db.query(DatabaseConnection)
            .order_by(DatabaseConnection.created_at.desc())
            .all()
        )

    def update(
        self,
        db: Session,
        connection: DatabaseConnection,
    ) -> DatabaseConnection:

        db.commit()
        db.refresh(connection)

        return connection

    def delete(
        self,
        db: Session,
        connection: DatabaseConnection,
    ):

        db.delete(connection)
        db.commit()