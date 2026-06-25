from app.services.sql.validator import (
    sql_validator,
    SQLValidationError,
)

queries = [

    "SELECT * FROM users",

    """
    WITH x AS (
        SELECT * FROM users
    )
    SELECT * FROM x
    """,

    "DROP TABLE users",

    "DELETE FROM users",

    "UPDATE users SET role='admin'",

    "SELECT * FROM users; DELETE FROM users;",
]

for query in queries:

    print("=" * 60)

    print(query)

    try:

        sql_validator.validate(query)

        print("VALID")

    except SQLValidationError as e:

        print("INVALID")

        print(e)