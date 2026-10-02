from qdrant_client.models import Filter, FieldCondition, MatchValue

from app.services.embeddings.bge_embedding import (
    get_embedding,
)

from app.services.retrieval.client import (
    get_qdrant_client,
)


client = get_qdrant_client()


def search(
    query: str,
    collection_name: str = "knowledge_chunks",
    limit: int = 5,
    knowledge_base_id: str | None = None,
):

    query_vector = get_embedding(query)

    query_filter = None

    if knowledge_base_id:

        query_filter = Filter(
            must=[
                FieldCondition(
                    key="knowledge_base_id",
                    match=MatchValue(
                        value=str(
                            knowledge_base_id
                        )
                    ),
                )
            ]
        )

    response = client.query_points(
        collection_name=collection_name,
        query=query_vector,
        query_filter=query_filter,
        limit=limit,
    )

    return response.points