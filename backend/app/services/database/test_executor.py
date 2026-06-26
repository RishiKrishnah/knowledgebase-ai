from app.db.session import SessionLocal

from app.services.database.registry import database_registry
from app.services.database.connector import database_connector
from app.services.database.executor import database_executor

db = SessionLocal()

connection = database_registry.list_connections(db)[0]

engine = database_connector.connect(connection)

rows = database_executor.execute(
    engine,
    "SELECT COUNT(*) AS total FROM users;"
)

print(rows)