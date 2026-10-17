from abc import ABC, abstractmethod
from typing import AsyncIterator

class BaseProvider(ABC):
    @abstractmethod
    async def generate_response(self, prompt: str, system_prompt: str = None) -> str:
        pass
    
    @abstractmethod
    async def health_check(self) -> dict:
        pass
