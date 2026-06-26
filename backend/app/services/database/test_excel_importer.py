from pathlib import Path

from app.db.session import SessionLocal

from app.services.database.registry import database_registry
from app.services.database.excel_importer import excel_importer


db = SessionLocal()

try:

    #
    # Find School Database
    #

    connections = database_registry.list_connections(db)

    connection = next(
        c
        for c in connections
        if c.name == "School Database"
    )

    excel_importer.import_workbook(
        connection=connection,
        excel_path=Path("data/SchoolDB.xlsx"),
    )

finally:

    db.close()