from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database import Base, engine
from app.routers import auth, complaints, admin, analytics, notifications
import app.models.user  # noqa – ensure models are registered
import app.models.complaint  # noqa
import app.models.ai_prediction  # noqa
import app.models.comment  # noqa
import app.models.notification  # noqa
import os

# Create all tables on startup (use Alembic for production migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Campus Complaint Analysis System",
    description="Hybrid AI-powered complaint management for campus services",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded images
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(admin.router)
app.include_router(analytics.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    return {"message": "AI Campus Complaint System API", "docs": "/docs"}
