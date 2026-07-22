import uuid
import os
import shutil
from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db, SessionLocal
from app.models.complaint import Complaint
from app.models.ai_prediction import AIPrediction
from app.models.user import User
from app.models.comment import Comment
from app.schemas.complaint import ComplaintOut
from app.schemas.comment import CommentCreate, CommentOut
from app.utils.jwt import get_current_user
from app.services.ai_service import analyze_complaint
from app.services.notification_service import create_notifications_for_admins, create_comment_notification
from app.config import UPLOAD_DIR

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

os.makedirs(UPLOAD_DIR, exist_ok=True)


async def run_ai_analysis_background(complaint_id: uuid.UUID, title: str, description: str):
    db: Session = SessionLocal()
    try:
        analysis = await analyze_complaint(title, description)
        prediction = AIPrediction(
            id=uuid.uuid4(),
            complaint_id=complaint_id,
            category=analysis.get("category"),
            confidence=analysis.get("confidence"),
            sentiment=analysis.get("sentiment"),
            priority=analysis.get("priority"),
            summary=analysis.get("summary"),
            department_suggestion=analysis.get("department_suggestion"),
            admin_recommendation=analysis.get("admin_recommendation"),
            model_used=analysis.get("model_used", "ml"),
        )
        db.add(prediction)
        db.commit()
    except Exception as e:
        print(f"Background AI analysis error: {e}")
    finally:
        db.close()


@router.post("/", response_model=ComplaintOut, status_code=201)
async def submit_complaint(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    image_url = None
    if image and image.filename:
        ext = image.filename.rsplit(".", 1)[-1].lower()
        if ext not in ["jpg", "jpeg", "png", "gif", "webp"]:
            raise HTTPException(status_code=400, detail="Invalid image format")
        filename = f"{uuid.uuid4()}.{ext}"
        path = os.path.join(UPLOAD_DIR, filename)
        with open(path, "wb") as f:
            shutil.copyfileobj(image.file, f)
        image_url = f"/uploads/{filename}"

    complaint = Complaint(
        id=uuid.uuid4(),
        user_id=current_user.id,
        title=title,
        description=description,
        image_url=image_url,
        status="Pending",
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    # Send notifications to all admins
    create_notifications_for_admins(db, complaint)

    # Queue AI analysis in the background so the user gets an instant response
    background_tasks.add_task(run_ai_analysis_background, complaint.id, title, description)

    return complaint


@router.get("/my", response_model=List[ComplaintOut])
def my_complaints(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Complaint)
        .filter(Complaint.user_id == current_user.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )


@router.get("/{complaint_id}", response_model=ComplaintOut)
def get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(Complaint).filter(Complaint.id == uuid.UUID(complaint_id)).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    if complaint.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return complaint


@router.post("/{complaint_id}/comments", response_model=CommentOut)
def add_comment(
    complaint_id: str,
    payload: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(Complaint).filter(Complaint.id == uuid.UUID(complaint_id)).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    
    if complaint.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    comment = Comment(
        id=uuid.uuid4(),
        complaint_id=complaint.id,
        user_id=current_user.id,
        content=payload.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)

    # Trigger comment notification
    create_comment_notification(db, comment, complaint, current_user)

    return comment


@router.get("/{complaint_id}/comments", response_model=List[CommentOut])
def get_comments(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = db.query(Complaint).filter(Complaint.id == uuid.UUID(complaint_id)).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
        
    if complaint.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Comment).filter(Comment.complaint_id == complaint.id).order_by(Comment.created_at.asc()).all()
