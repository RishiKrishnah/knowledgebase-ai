from pprint import pprint

from app.db.session import SessionLocal

from app.services.database.registry import database_registry
from app.services.database.connector import database_connector
from app.services.database.inspector import database_inspector

db = SessionLocal()

connection = database_registry.list_connections(db)[0]

engine = database_connector.connect(connection)

schema = database_inspector.inspect(engine)

pprint(schema)