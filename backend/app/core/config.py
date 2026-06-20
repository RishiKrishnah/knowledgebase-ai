from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    QDRANT_HOST: str
    QDRANT_PORT: int

    OPENROUTER_API_KEY: str

    model_config = SettingsConfigDict(
        env_file=".env"
    )


settings = Settings()