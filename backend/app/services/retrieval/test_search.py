from app.services.retrieval.search import search

results = search("Explain artificial intelligence")

for hit in results:
    print()
    print(hit.score)
    print(hit.payload["text"])