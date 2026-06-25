from app.services.retrieval.search import search


SCHEMA_COLLECTION = "database_schema"


def retrieve_schema(
    question: str,
    limit: int = 5,
) -> str:

    results = search(
        query=question,
        collection_name=SCHEMA_COLLECTION,
        limit=limit,
    )

    contexts = []

    for hit in results:
        contexts.append(hit.payload["text"])

    return "\n\n".join(contexts)