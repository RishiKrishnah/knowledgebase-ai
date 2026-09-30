from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # ----------------------------------------------------------
    # Application
    # ----------------------------------------------------------

    APP_NAME: str = "KnowledgeBase AI"
    APP_VERSION: str = "2.0"
    DEBUG: bool = False

    # ----------------------------------------------------------
    # Database
    # ----------------------------------------------------------

    DATABASE_URL: str

    # ----------------------------------------------------------
    # Qdrant
    # ----------------------------------------------------------

    QDRANT_URL: str
    QDRANT_API_KEY: str | None = None

    # ----------------------------------------------------------
    # LLM
    # ----------------------------------------------------------

    OPENROUTER_API_KEY: str

    # ----------------------------------------------------------
    # Frontend
    # ----------------------------------------------------------

    FRONTEND_ORIGIN: str | None = None

    # ----------------------------------------------------------
    # Uploads
    # ----------------------------------------------------------

    UPLOAD_DIRECTORY: str = "/tmp/knowledgebase-uploads"

    # ----------------------------------------------------------
    # Authentication
    # ----------------------------------------------------------

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()