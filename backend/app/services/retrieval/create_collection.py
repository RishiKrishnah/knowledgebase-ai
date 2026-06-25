from qdrant_client.models import Distance, VectorParams
from app.services.retrieval.client import get_qdrant_client

client = get_qdrant_client()

client.recreate_collection(
    collection_name="knowledge_chunks",
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE
    )
)

print("Collection created.")