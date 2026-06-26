from fastapi import HTTPException


class ChatException(HTTPException):
    def __init__(self, detail: str):
        super().__init__(
            status_code=500,
            detail=detail,
        )


class DatabaseAgentException(ChatException):
    pass


class SQLGenerationException(ChatException):
    pass


class SQLExecutionException(ChatException):
    pass


class RetrievalException(ChatException):
    pass


class LLMException(ChatException):
    pass