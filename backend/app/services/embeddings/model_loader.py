import os
from huggingface_hub import InferenceClient

_client = None

MODEL_NAME = "BAAI/bge-small-en-v1.5"


def get_client():
    global _client

    if _client is None:
        token = os.getenv("HF_TOKEN")

        if not token:
            raise RuntimeError(
                "HF_TOKEN environment variable is not configured."
            )

        _client = InferenceClient(
            provider="hf-inference",
            api_key=token,
        )

    return _client


def get_embedding(text: str) -> list[float]:
    client = get_client()

    result = client.feature_extraction(
        text,
        model=MODEL_NAME,
    )

    return result.tolist()