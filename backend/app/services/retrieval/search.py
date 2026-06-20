from app.services.embeddings.bge_embedding import get_embedding
from app.services.retrieval.qdrant_service import client

COLLECTION_NAME = "knowledge_chunks"


def search(query: str, limit: int = 5):

    query_vector = get_embedding(query)

    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
    )

    return response.points