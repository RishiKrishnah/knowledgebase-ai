from functools import lru_cache

from qdrant_client import QdrantClient

from app.core.config import settings


@lru_cache
def get_qdrant_client() -> QdrantClient:

    return QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY,
    )