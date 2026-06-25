from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    ########################################
    # Application
    ########################################

    APP_NAME: str = "KnowledgeBase AI"
    APP_VERSION: str = "2.0"

    DEBUG: bool = True

    ########################################
    # PostgreSQL
    ########################################

    POSTGRES_HOST: str
    POSTGRES_PORT: int
    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    ########################################
    # Qdrant
    ########################################

    QDRANT_HOST: str
    QDRANT_PORT: int

    ########################################
    # Redis
    ########################################

    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379

    ########################################
    # OpenRouter
    ########################################

    OPENROUTER_API_KEY: str

    ########################################
    # Uploads
    ########################################

    UPLOAD_DIRECTORY: str = "uploads"

    ########################################
    # JWT (Future)
    ########################################

    JWT_SECRET: str = "change_me"

    JWT_ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    ########################################

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()