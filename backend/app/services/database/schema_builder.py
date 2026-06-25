from typing import Dict


class SchemaBuilder:

    def build_documents(
        self,
        schema: Dict,
    ) -> list[dict]:

        documents = []

        for table_name, table in schema.items():

            text = f"Table: {table_name}\n\n"

            text += "Columns:\n"

            for column in table["columns"]:

                nullable = "NULL" if column["nullable"] else "NOT NULL"

                text += (
                    f"- {column['name']} "
                    f"({column['type']}, {nullable})\n"
                )

            text += "\nPrimary Keys:\n"

            for pk in table["primary_key"]:
                text += f"- {pk}\n"

            text += "\nForeign Keys:\n"

            if table["foreign_keys"]:

                for fk in table["foreign_keys"]:

                    text += (
                        f"- {fk['constrained_columns'][0]}"
                        f" -> "
                        f"{fk['referred_table']}."
                        f"{fk['referred_columns'][0]}\n"
                    )

            else:

                text += "None\n"

            documents.append(
                {
                    "table": table_name,
                    "text": text,
                }
            )

        return documents


schema_builder = SchemaBuilder()