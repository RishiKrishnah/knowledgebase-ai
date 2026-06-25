from sqlglot import parse_one
from sqlglot.errors import ParseError
from sqlglot.expressions import Select, With


class SQLValidationError(Exception):
    pass


class SQLValidator:

    FORBIDDEN_KEYWORDS = {
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "CREATE",
        "TRUNCATE",
        "MERGE",
        "GRANT",
        "REVOKE",
    }

    def validate(self, sql: str) -> str:

        sql = sql.strip().rstrip(";")

        upper_sql = sql.upper()

        for keyword in self.FORBIDDEN_KEYWORDS:

            if keyword in upper_sql:
                raise SQLValidationError(
                    f"Forbidden SQL statement: {keyword}"
                )

        if ";" in sql:
            raise SQLValidationError(
                "Multiple SQL statements are not allowed."
            )

        try:
            expression = parse_one(
                sql,
                read="postgres",
            )

        except ParseError as e:
            raise SQLValidationError(
                str(e)
            )

        if not isinstance(expression, (Select, With)):
            raise SQLValidationError(
                "Only SELECT queries are allowed."
            )

        return sql


sql_validator = SQLValidator()