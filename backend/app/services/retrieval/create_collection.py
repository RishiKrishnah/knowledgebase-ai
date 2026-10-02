from qdrant_client.models import (
    Distance,
    PayloadSchemaType,
    VectorParams,
)

from app.services.retrieval.client import get_qdrant_client


COLLECTION_NAME = "knowledge_chunks"
VECTOR_SIZE = 384


client = get_qdrant_client()


# ------------------------------------------------------------
# Create collection only if it does not exist
# ------------------------------------------------------------

collections = client.get_collections().collections

collection_exists = any(
    collection.name == COLLECTION_NAME
    for collection in collections
)


if not collection_exists:

    client.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=VECTOR_SIZE,
            distance=Distance.COSINE,
        ),
    )

    print(
        f"Created collection: {COLLECTION_NAME}"
    )

else:

    print(
        f"Collection already exists: {COLLECTION_NAME}"
    )


# ------------------------------------------------------------
# Create payload index for knowledge_base_id
# ------------------------------------------------------------

client.create_payload_index(
    collection_name=COLLECTION_NAME,
    field_name="knowledge_base_id",
    field_schema=PayloadSchemaType.KEYWORD,
)

print(
    "Payload index created for: knowledge_base_id"
)