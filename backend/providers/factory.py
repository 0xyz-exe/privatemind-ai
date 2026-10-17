from config import settings
from providers.base import BaseProvider
from providers.demo import DemoProvider
from providers.ollama import OllamaProvider

def get_provider() -> BaseProvider:
    if settings.inference_mode == "ollama":
        return OllamaProvider()
    else:  # demo is default
        return DemoProvider()
