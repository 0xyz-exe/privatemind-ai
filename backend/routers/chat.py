from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from database import get_db, Conversation, Message
from providers.factory import get_provider
from datetime import datetime
import json

router = APIRouter()

class CreateConversationRequest(BaseModel):
    title: str = "New Conversation"

class SendMessageRequest(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    sources: list[dict] | None = None
    created_at: datetime

    model_config = {"from_attributes": True}

    @field_validator("sources", mode="before")
    @classmethod
    def parse_sources(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except Exception:
                return None
        return v

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse] = []

    model_config = {"from_attributes": True}

@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(req: CreateConversationRequest, db: Session = Depends(get_db)):
    conv = Conversation(title=req.title)
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv

@router.get("/conversations", response_model=list[ConversationResponse])
def list_conversations(db: Session = Depends(get_db)):
    return db.query(Conversation).order_by(Conversation.updated_at.desc()).all()

@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
def get_conversation(conversation_id: int, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conv

@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def send_message(conversation_id: int, req: SendMessageRequest, db: Session = Depends(get_db)):
    conv = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Save user message
    user_msg = Message(conversation_id=conversation_id, role="user", content=req.content)
    db.add(user_msg)
    db.commit()
    
    # Generate response
    provider = get_provider()
    try:
        response_text = await provider.generate_response(req.content)
    except Exception as e:
        response_text = f"Error generating response: {str(e)}"
    
    # Save assistant message
    assistant_msg = Message(conversation_id=conversation_id, role="assistant", content=response_text)
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)
    
    return assistant_msg
