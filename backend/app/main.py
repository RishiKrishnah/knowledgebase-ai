from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.chat import router as chat_router
from app.api.routes.connections import router as connection_router
from app.api.routes.documents import router as document_router
from app.api.routes.knowledge_bases import (
    router as knowledge_base_router,
)
from app.api.routes.search import router as search_router
from app.api.routes.sessions import router as session_router
from app.core.config import settings
from app.api.routes.dashboard import router as dashboard_router

app = FastAPI(
    title="KnowledgeBase AI",
    version="1.0.0",
)


allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

if settings.FRONTEND_ORIGIN:
    allowed_origins.append(
        settings.FRONTEND_ORIGIN
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat_router)
app.include_router(search_router)
app.include_router(connection_router)
app.include_router(session_router)
app.include_router(document_router)
app.include_router(knowledge_base_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "service": "knowledgebase-backend",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "knowledgebase-backend",
    }