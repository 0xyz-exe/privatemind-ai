import httpx
from providers.base import BaseProvider
from config import settings

class OllamaProvider(BaseProvider):
    def __init__(self):
        self.base_url = settings.ollama_base_url
        self.model = settings.ollama_model
    
    async def generate_response(self, prompt: str, system_prompt: str = None) -> str:
        async with httpx.AsyncClient(timeout=120.0) as client:
            payload = {
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }
            if system_prompt:
                payload["system"] = system_prompt
            
            response = await client.post(
                f"{self.base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            return response.json()["response"]
    
    async def health_check(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                response.raise_for_status()
                models = [m["name"] for m in response.json().get("models", [])]
                return {
                    "available": self.model in models,
                    "mode": "ollama",
                    "model": self.model,
                    "models_available": models
                }
        except Exception as e:
            return {
                "available": False,
                "mode": "ollama",
                "error": str(e)
            }
