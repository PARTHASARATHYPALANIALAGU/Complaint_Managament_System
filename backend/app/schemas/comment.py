from pydantic import BaseModel, ConfigDict
from typing import Optional
from uuid import UUID
from datetime import datetime


class CommentUserOut(BaseModel):
    id: UUID
    name: str
    role: str

    model_config = ConfigDict(from_attributes=True)


class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: UUID
    content: str
    created_at: datetime
    user_id: UUID
    user: CommentUserOut

    model_config = ConfigDict(from_attributes=True)
