# Deployment Guide

You can run this project either via **Docker** (recommended) or **locally on your machine**.

---

## Method 1: Docker Compose (Recommended)

This method ensures you don't have to install PostgreSQL or configure environments manually.

### 1. Configure Environment
1. Copy the `.env.example` in `backend/` to a new file named `.env`.
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Insert your OpenRouter API key into the `backend/.env` file.

### 2. Startup
Run the following command in the project root:
```bash
docker-compose up --build
```

### 3. Access the Apps
- **Frontend App**: http://localhost:5173
- **FastAPI OpenAPI Swagger**: http://localhost:8000/docs
- **Database Console**: accessible at `localhost:5432` with user `postgres` / pass `password`. (Initial tables are auto-created when the FastAPI container starts up).

---

## Method 2: Local Development Setup

If you want to run the React app and Python app directly on your host machine.

### 1. Database
Make sure you have PostgreSQL running locally on port `5432`. Create a database named `campus_complaints`. Run the `init.sql` script to create the UUID extension and admin user.

### 2. Train the AI Model
```bash
cd ai_module
pip install -r requirements.txt
python train_model.py
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your local Postgres URL and API Key
uvicorn app.main:app --reload
```

### 4. Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173`.
