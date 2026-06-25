from fastapi import FastAPI
from app.api.routes.search import router as search_router
from app.api.routes.chat import router as chat_router
from app.services.embeddings.model_loader import get_model
from app.api.routes.connections import (
    router as connection_router,
)

app = FastAPI(
    title="KnowledgeBase AI",
    version="1.0.0"
)

app.include_router(chat_router)
app.include_router(search_router)
app.include_router(connection_router)

@app.on_event("startup")
async def startup():

    print("Loading embedding model...")

    get_model()

    print("Model loaded.")

@app.get("/")
def root():
    return {
        "status": "running"
    }