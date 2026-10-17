from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db, Document
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class DocumentResponse(BaseModel):
    id: int
    filename: str
    mime_type: str
    file_size: int
    status: str
    chunk_count: int
    created_at: datetime

    model_config = {"from_attributes": True}

@router.post("/documents", response_model=DocumentResponse)
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Placeholder for MVP - full implementation in next milestone
    content = await file.read()
    
    doc = Document(
        filename=file.filename,
        file_path=f"./data/{file.filename}",
        mime_type=file.content_type or "application/octet-stream",
        file_size=len(content),
        content_hash="placeholder",
        status="pending"
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return doc

@router.get("/documents", response_model=list[DocumentResponse])
def list_documents(db: Session = Depends(get_db)):
    return db.query(Document).order_by(Document.created_at.desc()).all()
