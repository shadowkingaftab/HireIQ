# ProofHire

**Proof-of-Skill Intelligence Network for Developers.**

Replace resumes with verifiable capability profiles. ProofHire analyzes real contributions and skills to provide a transparent, data-driven hiring platform.

## 🚀 Overview

ProofHire is designed to bridge the gap between developer talent and hiring needs by focusing on "Proof of Skill". It integrates with platforms like GitHub to verify actual coding contributions and provides a comprehensive profile for developers.

### Core Features (Week 2)
- **Resume Parser**: PDF text extraction and skill/experience identification.
- **JD Parser**: Extraction of required and nice-to-have skills from job descriptions.
- **GitHub Fetcher**: Automated capability analysis using GitHub repository data.
- **Semantic Matching**: AI-powered fit score using sentence embeddings and cosine similarity.

## 🛠 Tech Stack

- **Backend:** FastAPI (Python)
- **Frontend:** React (Vite)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Styling:** Tailwind CSS

## 📁 Project Structure

```text
proofhire/
├── backend/            # FastAPI backend
│   ├── app/
│   │   ├── models/     # SQLAlchemy models
│   │   ├── services/   # Business logic
│   │   └── utils/      # Helpers
│   └── main.py         # Entry point
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── main.jsx
├── docs/               # Documentation
├── scripts/            # Utility scripts
└── README.md
```

## 🛠 Setup

### Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up your `.env` file with your PostgreSQL URL:
   ```text
   DB_URL=postgresql://username:password@localhost:5432/proofhire
   ```
5. Run the server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

### Database
1. Install PostgreSQL.
2. Create a database named `proofhire`.
3. Run the test script to initialize tables:
   ```bash
   python scripts/test_db.py
   ```

## 📚 Documentation

- [API Reference](docs/API.md) - Detailed information on all backend endpoints.
- [Architecture](docs/ARCHITECTURE.md) - High-level overview of the system design.
- [Roadmap](docs/ROADMAP.md) - Future plans and development phases.
- [Sample Data](docs/samples.md) - Test data for resumes, JDs, and GitHub profiles.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
