import uuid
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User
from app.models.complaint import Complaint
from app.models.comment import Comment

def create_notifications_for_admins(db: Session, complaint: Complaint):
    """
    Finds all administrators in the database and creates a NEW_COMPLAINT
    notification for each of them.
    """
    try:
        admins = db.query(User).filter(User.role == "admin").all()
        student_name = complaint.user.name if complaint.user else "A student"
        
        for admin in admins:
            notif = Notification(
                id=uuid.uuid4(),
                user_id=admin.id,
                title="New Complaint Submitted",
                message=f"'{complaint.title}' has been submitted by {student_name}.",
                type="NEW_COMPLAINT",
                complaint_id=complaint.id,
                is_read=False
            )
            db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error creating admin notifications: {e}")

def create_status_notification(db: Session, complaint: Complaint, new_status: str):
    """
    Notifies the student (complaint owner) that their ticket status has updated.
    """
    try:
        notif = Notification(
            id=uuid.uuid4(),
            user_id=complaint.user_id,
            title="Complaint Status Updated",
            message=f"Your complaint '{complaint.title}' is now marked as '{new_status}'.",
            type="STATUS_UPDATE",
            complaint_id=complaint.id,
            is_read=False
        )
        db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error creating status notification: {e}")

def create_comment_notification(db: Session, comment: Comment, complaint: Complaint, sender: User):
    """
    When a new comment is posted:
    - If student commented: notifies all admins.
    - If admin commented: notifies the student (complaint owner).
    """
    try:
        if sender.role == "admin":
            # Notify the student owner
            notif = Notification(
                id=uuid.uuid4(),
                user_id=complaint.user_id,
                title="New Message from Admin",
                message=f"An administrator replied on your complaint '{complaint.title}'.",
                type="NEW_MESSAGE",
                complaint_id=complaint.id,
                is_read=False
            )
            db.add(notif)
        else:
            # Notify all admin users
            admins = db.query(User).filter(User.role == "admin").all()
            for admin in admins:
                notif = Notification(
                    id=uuid.uuid4(),
                    user_id=admin.id,
                    title="New Message from Student",
                    message=f"{sender.name} replied on complaint '{complaint.title}'.",
                    type="NEW_MESSAGE",
                    complaint_id=complaint.id,
                    is_read=False
                )
                db.add(notif)
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Error creating comment notification: {e}")
