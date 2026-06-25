from qdrant_client.models import Distance, VectorParams

from app.services.retrieval.client import get_qdrant_client

client = get_qdrant_client()

COLLECTION_NAME = "database_schema"

collections = client.get_collections().collections

exists = any(c.name == COLLECTION_NAME for c in collections)

if not exists:
    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=384,
            distance=Distance.COSINE,
        ),
    )

    print("database_schema collection created.")

else:
    print("database_schema collection already exists.")