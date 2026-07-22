import uuid
from sqlalchemy import Column, Text, ForeignKey, DateTime, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    complaint_id = Column(Uuid, ForeignKey("complaints.id"), nullable=False)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="comments")
    user = relationship("User", back_populates="comments")
