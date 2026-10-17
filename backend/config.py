from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    database_url: str = "sqlite:///./data/privatemind.db"
    inference_mode: str = "demo"
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    embedding_model: str = "all-minilm-l6-v2"
    data_dir: Path = Path("./data")
    max_upload_size_mb: int = 50
    chunk_size: int = 512
    chunk_overlap: int = 50

    class Config:
        env_file = ".env"

settings = Settings()
settings.data_dir.mkdir(parents=True, exist_ok=True)
