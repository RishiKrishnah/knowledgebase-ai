from app.services.embeddings.model_loader import get_model


def get_embedding(text: str):

    model = get_model()

    embedding = model.encode(
        text,
        normalize_embeddings=True
    )

    return embedding.tolist()