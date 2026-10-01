import pandas as pd
from sqlalchemy import create_engine, text

# ============================================================
# SUPABASE SCHOOL DATABASE
# ============================================================

USER = "postgres.gkngwrwmkktedinlabji"
PASSWORD = "p1458ymFJdQLaGdM"
HOST = "aws-0-ap-south-1.pooler.supabase.com"
PORT = "5432"
DBNAME = "postgres"

DATABASE_URL = (
    f"postgresql+psycopg2://"
    f"{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"
    f"?sslmode=require"
)

engine = create_engine(DATABASE_URL)

EXCEL_FILE = "backend/data/SchoolDB.xlsx"

# ============================================================
# IMPORT DATA
# ============================================================

tables = [
    "Departments",
    "Teachers",
    "Courses",
    "Students",
    "Classes",
    "Enrollments",
    "Exams",
    "Marks",
    "Attendance",
]

with engine.begin() as conn:

    for sheet in tables:

        print(f"Importing {sheet}...")

        df = pd.read_excel(
            EXCEL_FILE,
            sheet_name=sheet,
        )

        # Convert column names to lowercase
        df.columns = [
            str(column).strip().lower().replace(" ", "_")
            for column in df.columns
        ]

        table_name = sheet.lower()

        df.to_sql(
            table_name,
            con=conn,
            if_exists="replace",
            index=False,
        )

        print(
            f"  {table_name}: {len(df)} rows imported"
        )

print("\nImport completed successfully.")
