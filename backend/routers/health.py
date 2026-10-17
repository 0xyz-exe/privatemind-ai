from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from config import settings
from providers.factory import get_provider

router = APIRouter()

@router.get("/health")
async def health_check(db: Session = Depends(get_db)):
    provider = get_provider()
    provider_status = await provider.health_check()
    
    return {
        "status": "ok",
        "inference_mode": settings.inference_mode,
        "provider_available": provider_status["available"],
        "database": "connected"
    }
