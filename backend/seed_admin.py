import os
from app.database import SessionLocal, engine, Base
from app.models.user import User
import app.models.complaint  # noqa
import app.models.ai_prediction  # noqa
import bcrypt

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()
    try:
        admin_email = "admin@university.edu"
        existing = db.query(User).filter(User.email == admin_email).first()
        if existing:
            if existing.role != "admin":
                existing.role = "admin"
                db.commit()
                print("Upgraded existing user to admin!")
            else:
                print("Admin already exists!")
            return
        
        admin_user = User(
            name="System Admin",
            email=admin_email,
            password_hash=bcrypt.hashpw("admin123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Successfully created admin user: admin@university.edu / admin123")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
