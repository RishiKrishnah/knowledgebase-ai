from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.database_connection import (
    DatabaseConnectionCreate,
    DatabaseConnectionResponse,
    DatabaseConnectionUpdate,
)

from app.services.database.registry import (
    database_registry,
)


router = APIRouter(
    prefix="/connections",
    tags=["Connections"],
)


@router.get(
    "",
    response_model=list[DatabaseConnectionResponse],
)
def list_connections(
    db: Session = Depends(get_db),
):

    return database_registry.list_connections(
        db=db,
    )


@router.get(
    "/{connection_id}",
    response_model=DatabaseConnectionResponse,
)
def get_connection(
    connection_id: UUID,
    db: Session = Depends(get_db),
):

    connection = (
        database_registry.get_connection(
            db=db,
            connection_id=connection_id,
        )
    )

    if connection is None:
        raise HTTPException(
            status_code=404,
            detail="Database connection not found.",
        )

    return connection


@router.post(
    "",
    response_model=DatabaseConnectionResponse,
    status_code=201,
)
def create_connection(
    request: DatabaseConnectionCreate,
    db: Session = Depends(get_db),
):

    connection = (
        database_registry.create_connection(
            db=db,
            name=request.name.strip(),
            db_type=request.db_type.strip().lower(),
            host=request.host.strip(),
            port=request.port,
            database_name=request.database_name.strip(),
            username=request.username.strip(),
            password=request.password,
        )
    )

    return connection


@router.patch(
    "/{connection_id}",
    response_model=DatabaseConnectionResponse,
)
def update_connection(
    connection_id: UUID,
    request: DatabaseConnectionUpdate,
    db: Session = Depends(get_db),
):

    connection = (
        database_registry.get_connection(
            db=db,
            connection_id=connection_id,
        )
    )

    if connection is None:
        raise HTTPException(
            status_code=404,
            detail="Database connection not found.",
        )

    update_data = request.model_dump(
        exclude_unset=True
    )

    if "name" in update_data:
        connection.name = (
            update_data["name"].strip()
        )

    if "db_type" in update_data:
        connection.db_type = (
            update_data["db_type"]
            .strip()
            .lower()
        )

    if "host" in update_data:
        connection.host = (
            update_data["host"].strip()
        )

    if "port" in update_data:
        connection.port = (
            update_data["port"]
        )

    if "database_name" in update_data:
        connection.database_name = (
            update_data[
                "database_name"
            ].strip()
        )

    if "username" in update_data:
        connection.username = (
            update_data["username"].strip()
        )

    if "password" in update_data:
        connection.password = (
            update_data["password"]
        )

    if "is_active" in update_data:
        connection.is_active = (
            update_data["is_active"]
        )

    return database_registry.update_connection(
        db=db,
        connection=connection,
    )


@router.delete(
    "/{connection_id}",
)
def delete_connection(
    connection_id: UUID,
    db: Session = Depends(get_db),
):

    connection = (
        database_registry.get_connection(
            db=db,
            connection_id=connection_id,
        )
    )

    if connection is None:
        raise HTTPException(
            status_code=404,
            detail="Database connection not found.",
        )

    database_registry.delete_connection(
        db=db,
        connection=connection,
    )

    return {
        "connection_id": str(connection_id),
        "status": "deleted",
    }