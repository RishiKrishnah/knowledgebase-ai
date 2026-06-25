from pydantic import BaseModel, ConfigDict

from uuid import UUID

class DatabaseConnectionCreate(BaseModel):
    name: str
    db_type: str
    host: str
    port: int
    database_name: str
    username: str
    password: str




class DatabaseConnectionResponse(BaseModel):

    model_config = ConfigDict(
        from_attributes=True
    )

    id: UUID
    name: str
    db_type: str
    host: str
    port: int
    database_name: str
    username: str
    is_active: bool