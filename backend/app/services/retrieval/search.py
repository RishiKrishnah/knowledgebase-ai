from app.services.embeddings.bge_embedding import get_embedding
from app.services.retrieval.client import get_qdrant_client

client = get_qdrant_client()


def search(
    query: str,
    collection_name: str = "knowledge_chunks",
    limit: int = 5,
):
    query_vector = get_embedding(query)

    response = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        limit=limit,
    )

    return response.points