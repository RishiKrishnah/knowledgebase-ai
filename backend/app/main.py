from fastapi import FastAPI

app = FastAPI(
    title="KnowledgeBase AI",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "status": "running",
        "service": "KnowledgeBase AI"
    }