from collections import defaultdict
from typing import List, Dict


class ConversationService:

    def __init__(self):
        self.sessions = defaultdict(list)

    def add_message(
        self,
        session_id: str,
        role: str,
        content: str,
    ):

        self.sessions[session_id].append(
            {
                "role": role,
                "content": content,
            }
        )

    def history(
        self,
        session_id: str,
        limit: int = 10,
    ) -> List[Dict]:

        return self.sessions[session_id][-limit:]


conversation_service = ConversationService()