# AI Campus Complaint Management System

A beautiful, production-ready Full Stack Web Application that leverages both Large Language Models (LLMs) and traditional Machine Learning (ML) to automatically categorize, prioritize, and summarize student complaints on a university campus.

## 🔥 Key Features

- **Hybrid AI Engine**: 
  - **LLM Layer** uses the Google Gemini API (processed asynchronously in the background for zero-latency UI) for advanced sentiment analysis, smart summarization, and generating automated responses and action plans for administrators.
  - **ML Layer** uses a custom-trained TF-IDF + Logistic Regression model as a lightning-fast offline fallback if the LLM API is unavailable.
- **Modern Student Dashboard**: Submit complaints with evidence attachments and track statuses in a clean, responsive interface.
- **Admin Command Center**: Sort, filter, and resolve complaints using an expandable card-based UI that presents the AI's recommendations at a glance.
- **Analytics Platform**: Full suite of metrics using Recharts (monthly trends, sentiment analysis, category distribution).

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend**: FastAPI (Python), SQLAlchemy ORM, JWT Authentication, Background Tasks
- **AI/ML**: Google Gemini REST API, Scikit-Learn (TF-IDF/Logistic Regression)
- **Database**: SQLite (Zero-config local persistence)

## 🚀 Getting Started Locally

### 1. Backend Setup

First, navigate to the `backend` folder and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside the `backend/` directory and add your keys:
```env
# backend/.env
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

DATABASE_URL=sqlite:///./campus_complaints.db

GEMINI_API_KEY=your_google_gemini_api_key_here
```

Start the backend server:
```bash
uvicorn app.main:app --reload
```

### 2. Frontend Setup

In a new terminal window, navigate to the `frontend` folder and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

### 3. Creating the First Admin

To bootstrap the system with an Admin account so you can view the Admin Dashboard, run the included seeding script from the backend directory:
```bash
cd backend
python seed_admin.py
```
This creates the master account:
- **Email:** `admin@university.edu`
- **Password:** `admin123`

## 🧠 Training the ML Model (Optional)

Before running the backend, you can train the Fallback ML Model so it generates the `.pkl` files (we have included fallback handling if you skip this).
```bash
cd ai_module
pip install -r requirements.txt
python train_model.py
```
This will train the model on a dataset of 500+ sample complaints, output accuracy metrics, generate a confusion matrix chart, and save the binary model files.
