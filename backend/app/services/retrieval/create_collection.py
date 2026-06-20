from qdrant_client.models import Distance, VectorParams
from app.services.retrieval.qdrant_service import client

client.recreate_collection(
    collection_name="knowledge_chunks",
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE
    )
)

print("Collection created.")