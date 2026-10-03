from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class DatabaseConnectionCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=1,
        max_length=100,
    )

    db_type: str = Field(
        ...,
        min_length=1,
        max_length=30,
    )

    host: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    port: int = Field(
        ...,
        ge=1,
        le=65535,
    )

    database_name: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    username: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )

    password: str = Field(
        ...,
        min_length=1,
        max_length=255,
    )


class DatabaseConnectionUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=1,
        max_length=100,
    )

    db_type: str | None = Field(
        default=None,
        min_length=1,
        max_length=30,
    )

    host: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    port: int | None = Field(
        default=None,
        ge=1,
        le=65535,
    )

    database_name: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    username: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    password: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )

    is_active: bool | None = None


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