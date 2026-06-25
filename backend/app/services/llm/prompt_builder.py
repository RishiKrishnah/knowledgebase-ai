from pathlib import Path

PROMPTS_DIR = Path(__file__).parent.parent.parent / "prompts"


def load_prompt(name: str) -> str:
    path = PROMPTS_DIR / f"{name}.txt"
    return path.read_text(encoding="utf-8")


def build_chat_prompt(question: str) -> str:
    template = load_prompt("chat")
    return template.format(question=question)


def build_rag_prompt(
    question: str,
    contexts: list[str],
) -> str:
    template = load_prompt("rag")

    return template.format(
        question=question,
        context="\n\n".join(contexts),
    )


def build_sql_prompt(
    question: str,
    schema: str,
) -> str:
    template = load_prompt("sql_generator")

    return template.format(
        question=question,
        schema=schema,
    )


def build_sql_response_prompt(
    question: str,
    sql: str,
    rows: list[dict],
) -> str:
    template = load_prompt("sql_response")

    return template.format(
        question=question,
        sql=sql,
        rows=rows,
    )