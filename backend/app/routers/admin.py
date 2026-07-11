from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.complaint import Complaint
from app.models.user import User
from app.schemas.complaint import ComplaintOut, ComplaintStatusUpdate
from app.utils.jwt import get_admin_user

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/complaints", response_model=List[ComplaintOut])
def list_all_complaints(
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    if search:
        query = query.filter(
            Complaint.title.ilike(f"%{search}%") | Complaint.description.ilike(f"%{search}%")
        )
    return query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()


@router.patch("/complaints/{complaint_id}/status", response_model=ComplaintOut)
def update_status(
    complaint_id: str,
    payload: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_admin_user),
):
    valid_statuses = ["Pending", "In Progress", "Resolved"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
    import uuid
    complaint = db.query(Complaint).filter(Complaint.id == uuid.UUID(complaint_id)).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    complaint.status = payload.status
    db.commit()
    db.refresh(complaint)
    return complaint
