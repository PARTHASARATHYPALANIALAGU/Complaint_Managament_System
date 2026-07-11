import uuid
from sqlalchemy import Column, String, Float, Text, ForeignKey, DateTime, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    complaint_id = Column(Uuid, ForeignKey("complaints.id"), nullable=False, unique=True)
    category = Column(String(100))
    confidence = Column(Float)
    sentiment = Column(String(50))
    priority = Column(String(50))
    summary = Column(Text)
    department_suggestion = Column(String(100))
    admin_recommendation = Column(Text)
    model_used = Column(String(50))  # "ml", "llm", "hybrid"
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="ai_prediction")
