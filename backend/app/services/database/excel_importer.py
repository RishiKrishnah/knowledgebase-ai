from pathlib import Path

import pandas as pd

from sqlalchemy import text

from app.services.database.connector import database_connector


class ExcelImporter:

    def import_workbook(
        self,
        connection,
        excel_path: str | Path,
    ):

        excel_path = Path(excel_path)

        if not excel_path.exists():
            raise FileNotFoundError(excel_path)

        engine = database_connector.connect(connection)

        workbook = pd.ExcelFile(excel_path)

        print()

        print(f"Workbook: {excel_path.name}")

        print()

        print("Sheets:")

        print(workbook.sheet_names)

        with engine.begin() as conn:

            for sheet in workbook.sheet_names:

                print(f"\nImporting {sheet}...")

                df = pd.read_excel(
                    workbook,
                    sheet_name=sheet,
                )

                #
                # Clean column names
                #

                df.columns = [
                    str(c)
                    .strip()
                    .lower()
                    .replace(" ", "_")
                    for c in df.columns
                ]

                #
                # Replace table
                #

                df.to_sql(
                    name=sheet.lower(),
                    con=conn,
                    if_exists="replace",
                    index=False,
                )

                print(
                    f"Imported {len(df)} rows."
                )

        print()

        print("Import completed.")


excel_importer = ExcelImporter()