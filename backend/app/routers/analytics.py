import csv
import io
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.complaint import Complaint
from app.models.ai_prediction import AIPrediction
from app.models.user import User
from app.utils.jwt import get_admin_user

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    total = db.query(Complaint).count()
    pending = db.query(Complaint).filter(Complaint.status == "Pending").count()
    in_progress = db.query(Complaint).filter(Complaint.status == "In Progress").count()
    resolved = db.query(Complaint).filter(Complaint.status == "Resolved").count()
    high_priority = (
        db.query(AIPrediction).filter(AIPrediction.priority == "High").count()
    )
    return {
        "total": total,
        "pending": pending,
        "in_progress": in_progress,
        "resolved": resolved,
        "high_priority": high_priority,
    }


@router.get("/categories")
def get_categories(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    rows = (
        db.query(AIPrediction.category, func.count(AIPrediction.id))
        .group_by(AIPrediction.category)
        .all()
    )
    return [{"category": r[0] or "Unknown", "count": r[1]} for r in rows]


@router.get("/sentiment")
def get_sentiment(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    rows = (
        db.query(AIPrediction.sentiment, func.count(AIPrediction.id))
        .group_by(AIPrediction.sentiment)
        .all()
    )
    return [{"sentiment": r[0] or "Unknown", "count": r[1]} for r in rows]


@router.get("/trends")
def get_monthly_trends(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    rows = (
        db.query(
            func.strftime("%Y-%m", Complaint.created_at).label("month"),
            func.count(Complaint.id).label("count"),
        )
        .group_by("month")
        .order_by("month")
        .limit(12)
        .all()
    )
    return [{"month": r[0], "count": r[1]} for r in rows]


@router.get("/export/csv")
def export_csv(db: Session = Depends(get_db), _admin: User = Depends(get_admin_user)):
    complaints = (
        db.query(Complaint)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "ID", "Title", "Description", "Status", "Category", "Sentiment",
        "Priority", "Confidence", "Summary", "DepartmentSuggestion",
        "AdminRecommendation", "ModelUsed", "CreatedAt",
    ])
    for c in complaints:
        p = c.ai_prediction
        writer.writerow([
            str(c.id), c.title, c.description, c.status,
            p.category if p else "", p.sentiment if p else "",
            p.priority if p else "", p.confidence if p else "",
            p.summary if p else "", p.department_suggestion if p else "",
            p.admin_recommendation if p else "", p.model_used if p else "",
            c.created_at.isoformat(),
        ])
    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=complaints.csv"},
    )
