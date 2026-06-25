import httpx

from app.core.config import settings


class OpenRouterProvider:

    MODEL = "google/gemma-3-4b-it"
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
    
    async def generate_messages(self, messages):

        headers = {
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        }

        payload = {
            "model": self.MODEL,
            "messages": messages,
        }

        async with httpx.AsyncClient(timeout=60) as client:

            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json=payload,
            )

        print("\nSTATUS:", response.status_code)
        print(response.text)

        response.raise_for_status()

        data = response.json()

        return data["choices"][0]["message"]["content"]