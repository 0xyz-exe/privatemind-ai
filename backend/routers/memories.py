from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, Memory

router = APIRouter()

class CreateMemoryRequest(BaseModel):
    content: str
    category: str = "general"
    tags: str | None = None

class UpdateMemoryRequest(BaseModel):
    content: str | None = None
    category: str | None = None
    enabled: bool | None = None
    tags: str | None = None

from datetime import datetime

class MemoryResponse(BaseModel):
    id: int
    content: str
    category: str
    enabled: bool
    tags: str | None
    source: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}

@router.post("/memories", response_model=MemoryResponse)
def create_memory(req: CreateMemoryRequest, db: Session = Depends(get_db)):
    memory = Memory(content=req.content, category=req.category, tags=req.tags)
    db.add(memory)
    db.commit()
    db.refresh(memory)
    return memory

@router.get("/memories", response_model=list[MemoryResponse])
def list_memories(enabled_only: bool = False, db: Session = Depends(get_db)):
    query = db.query(Memory)
    if enabled_only:
        query = query.filter(Memory.enabled == True)
    return query.order_by(Memory.created_at.desc()).all()

@router.get("/memories/{memory_id}", response_model=MemoryResponse)
def get_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    return memory

@router.patch("/memories/{memory_id}", response_model=MemoryResponse)
def update_memory(memory_id: int, req: UpdateMemoryRequest, db: Session = Depends(get_db)):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    
    if req.content is not None:
        memory.content = req.content
    if req.category is not None:
        memory.category = req.category
    if req.enabled is not None:
        memory.enabled = req.enabled
    if req.tags is not None:
        memory.tags = req.tags
    
    db.commit()
    db.refresh(memory)
    return memory

@router.delete("/memories/{memory_id}")
def delete_memory(memory_id: int, db: Session = Depends(get_db)):
    memory = db.query(Memory).filter(Memory.id == memory_id).first()
    if not memory:
        raise HTTPException(status_code=404, detail="Memory not found")
    db.delete(memory)
    db.commit()
    return {"status": "deleted"}
