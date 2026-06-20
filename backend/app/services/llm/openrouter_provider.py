import httpx

from app.core.config import settings


class OpenRouterProvider:

    MODEL = "google/gemma-3-4b-it:free"

    async def generate(self, prompt: str):

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}"
        }

        payload = {
            "model": self.MODEL,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }

        async with httpx.AsyncClient() as client:

            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload
            )

        data = response.json()

        return data["choices"][0]["message"]["content"]