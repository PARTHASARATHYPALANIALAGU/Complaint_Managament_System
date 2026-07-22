# CampusVoice — AI Campus Complaint Management System

A production-ready Full Stack Web Application that leverages Large Language Models (Google Gemini AI) and traditional Machine Learning (Scikit-Learn) to automatically categorize, prioritize, summarize, and resolve student complaints on a university campus.

## 🔥 Key Features

- **Hybrid AI Engine**: 
  - **LLM Layer**: Powered by Google Gemini API for background categorization, sentiment detection, urgency prioritization, and automated action plan recommendations.
  - **ML Layer**: TF-IDF + Logistic Regression fallback model ensuring zero-downtime classification if the Gemini API is offline.
- **Vibrant Light-Theme Design**: Modern, high-contrast, clean light interface built with Tailwind CSS, custom card shadows, pastel badge indicators, and dynamic micro-animations.
- **Two-Way Discussion Forum (Comments)**: Built-in contextual chat feature allowing students and administrators to converse directly on any complaint ticket to clarify details or post updates.
- **Full-Screen Under-Navbar Detail Drawer**: A slide-over detail view that presents the full complaint description, attached evidence, AI recommendations (admin view), and live chat while keeping the main navigation header fully visible.
- **Admin Command Center**: Filterable management table with instant status updates (`Pending` → `In Progress` → `Resolved`).
- **Real-Time Analytics & CSV Export**: Recharts-powered dashboard showcasing category distribution, sentiment breakdown, and submission trend lines with one-click CSV exporting.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Axios
- **Backend**: FastAPI (Python), SQLAlchemy ORM, Pydantic v2, JWT Authentication, Async Background Tasks
- **AI/ML**: Google Gemini REST API, Scikit-Learn (TF-IDF Vectorizer + Logistic Regression)
- **Database**: SQLite (Zero-config local persistence)

## 🚀 Getting Started Locally

### 1. Backend Setup

Navigate to the `backend` directory and install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` and configure your environment variables:
```env
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

In a new terminal window, navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

### 3. Bootstrap Admin Account

To create a default Admin account for testing the Admin Command Center, run:
```bash
cd backend
python seed_admin.py
```
- **Email:** `admin@university.edu`
- **Password:** `admin123`

## 🧠 Training the Fallback ML Model (Optional)

You can retrain the offline Fallback ML Model at any time:
```bash
cd ai_module
pip install -r requirements.txt
python train_model.py
```
This trains the model on sample campus complaints, prints evaluation metrics, generates a confusion matrix visualization, and saves binary `.pkl` files.

