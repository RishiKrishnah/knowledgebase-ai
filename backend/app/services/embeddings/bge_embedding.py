from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)


def get_embedding(text: str):
    embedding = model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()