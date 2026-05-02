# Architecture

## Overview
ProofHire is a Proof-of-Skill Intelligence Network built with a modern web stack.

## Components
- **Frontend:** React application built with Vite, styled with Tailwind CSS. It communicates with the backend via REST API.
- **Backend:** FastAPI application (Python) providing RESTful endpoints for data management and skill verification.
- **Database:** PostgreSQL for persistent storage of candidates, skills, and jobs.
- **ORM:** SQLAlchemy for database interactions.

## Data Flow
1. User interacts with the React frontend.
2. Frontend makes HTTP requests to the FastAPI backend.
3. Backend processes requests, interacts with the PostgreSQL database, and performs logic (like GitHub analysis).
4. Backend returns JSON responses to the frontend.

## Key Models
- **Candidate:** Represents a developer profile.
- **Skill:** Represents a verifiable skill.
- **Job:** Represents a job posting with required skills.
