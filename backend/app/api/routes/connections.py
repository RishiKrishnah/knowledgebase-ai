from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db

from app.schemas.database_connection import (
    DatabaseConnectionCreate,
    DatabaseConnectionResponse,
)

from app.services.database.registry import (
    database_registry,
)

router = APIRouter(
    prefix="/connections",
    tags=["Connections"],
)


@router.post(
    "",
    response_model=DatabaseConnectionResponse,
)
def create_connection(
    request: DatabaseConnectionCreate,
    db: Session = Depends(get_db),
):

    connection = database_registry.create_connection(
        db=db,
        name=request.name,
        db_type=request.db_type,
        host=request.host,
        port=request.port,
        database_name=request.database_name,
        username=request.username,
        password=request.password,
    )

    return connection