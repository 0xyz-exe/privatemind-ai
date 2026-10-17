from providers.base import BaseProvider

class DemoProvider(BaseProvider):
    async def generate_response(self, prompt: str, system_prompt: str = None) -> str:
        # Deterministic demo responses based on keywords
        prompt_lower = prompt.lower()
        
        if "document" in prompt_lower or "file" in prompt_lower:
            return "[DEMO MODE] I can help you work with documents. Please upload a file to get started with real document analysis."
        elif "memory" in prompt_lower or "remember" in prompt_lower:
            return "[DEMO MODE] Memory features allow you to save preferences and context. This is a demonstration response."
        elif "?" in prompt:
            return f"[DEMO MODE] This is a simulated response to: '{prompt[:50]}...'. Configure a real model in settings to get actual AI responses."
        else:
            return "[DEMO MODE] This is a demonstration inference engine. To use real AI models, configure Ollama (local) or an external provider in your settings."
    
    async def health_check(self) -> dict:
        return {"available": True, "mode": "demo", "model": "demo-v1"}
