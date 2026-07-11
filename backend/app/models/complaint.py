import uuid
from sqlalchemy import Column, String, Enum, DateTime, Text, ForeignKey, Uuid
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    image_url = Column(String(500), nullable=True)
    status = Column(
        Enum("Pending", "In Progress", "Resolved", name="complaint_status"),
        default="Pending",
        nullable=False,
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="complaints")
    ai_prediction = relationship("AIPrediction", back_populates="complaint", uselist=False)
