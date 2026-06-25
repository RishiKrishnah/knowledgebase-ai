from sqlalchemy import inspect
from sqlalchemy.engine import Engine


class DatabaseInspector:

    def inspect(self, engine: Engine):

        inspector = inspect(engine)

        schema = {}

        for table in inspector.get_table_names():

            columns = inspector.get_columns(table)

            primary_keys = inspector.get_pk_constraint(table)

            foreign_keys = inspector.get_foreign_keys(table)

            schema[table] = {
                "columns": [
                    {
                        "name": column["name"],
                        "type": str(column["type"]),
                        "nullable": column["nullable"],
                    }
                    for column in columns
                ],
                "primary_key": primary_keys.get(
                    "constrained_columns",
                    [],
                ),
                "foreign_keys": foreign_keys,
            }

        return schema


database_inspector = DatabaseInspector()