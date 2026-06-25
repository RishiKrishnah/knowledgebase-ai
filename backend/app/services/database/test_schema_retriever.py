from app.services.database.schema_retriever import retrieve_schema

schema = retrieve_schema(
    "How many users are registered?"
)

print(schema)