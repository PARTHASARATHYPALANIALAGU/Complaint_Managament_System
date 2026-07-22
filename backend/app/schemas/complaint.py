from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from app.schemas.comment import CommentOut


class AIPredictionOut(BaseModel):
    category: Optional[str]
    confidence: Optional[float]
    sentiment: Optional[str]
    priority: Optional[str]
    summary: Optional[str]
    department_suggestion: Optional[str]
    admin_recommendation: Optional[str]
    model_used: Optional[str]

    model_config = ConfigDict(protected_namespaces=(), from_attributes=True)


class ComplaintCreate(BaseModel):
    title: str
    description: str


class ComplaintStatusUpdate(BaseModel):
    status: str  # "Pending" | "In Progress" | "Resolved"


class ComplaintUserOut(BaseModel):
    id: UUID
    name: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class ComplaintOut(BaseModel):
    id: UUID
    title: str
    description: str
    image_url: Optional[str]
    status: str
    created_at: datetime
    updated_at: datetime
    user_id: UUID
    user: Optional[ComplaintUserOut] = None
    ai_prediction: Optional[AIPredictionOut]
    comments: List[CommentOut] = []

    class Config:
        from_attributes = True

