from uuid import uuid4

from qdrant_client.models import PointStruct

from app.db.session import SessionLocal
from app.services.database.registry import database_registry
from app.services.database.connector import database_connector
from app.services.database.inspector import database_inspector
from app.services.database.schema_builder import schema_builder

from app.services.embeddings.bge_embedding import get_embedding
from app.services.retrieval.client import get_qdrant_client

COLLECTION_NAME = "database_schema"

client = get_qdrant_client()


def ingest_schema():

    db = SessionLocal()

    try:

        connection = database_registry.list_connections(db)[0]

        engine = database_connector.connect(connection)

        schema = database_inspector.inspect(engine)

        documents = schema_builder.build_documents(schema)

        points = []

        for document in documents:

            embedding = get_embedding(document["text"])

            points.append(
                PointStruct(
                    id=str(uuid4()),
                    vector=embedding,
                    payload={
                        "table": document["table"],
                        "text": document["text"],
                    },
                )
            )

        client.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
        )

        print(
            f"Ingested {len(points)} schema documents."
        )

    finally:

        db.close()


if __name__ == "__main__":
    ingest_schema()