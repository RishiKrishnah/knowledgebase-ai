from uuid import uuid4

from qdrant_client.models import PointStruct

from app.services.ingestion.excel_parser import load_excel
from app.services.ingestion.document_builder import row_to_document
from app.services.embeddings.bge_embedding import get_embedding
from app.services.retrieval.qdrant_service import client


COLLECTION_NAME = "knowledge_chunks"


def ingest_excel(file_path: str):

    df = load_excel(file_path)

    points = []

    for _, row in df.iterrows():

        text = row_to_document(row)

        embedding = get_embedding(text)

        point = PointStruct(
            id=str(uuid4()),
            vector=embedding,
            payload={
                "text": text
            }
        )

        points.append(point)

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )

    print(f"{len(points)} documents inserted.")


if __name__ == "__main__":
    ingest_excel("data/sample.xlsx")