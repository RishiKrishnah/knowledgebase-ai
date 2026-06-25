from app.db.session import SessionLocal

from app.services.database.registry import database_registry
from app.services.database.connector import database_connector

db = SessionLocal()

connections = database_registry.list_connections(db)

if not connections:
    print("No registered databases.")
    exit()

connection = connections[0]

engine = database_connector.connect(connection)

print(engine)