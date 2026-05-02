import requests
import os
from typing import Dict, List
from sqlalchemy.orm import Session
from ..models.candidate import Candidate
from ..models.job import Job
from .matching_engine import calculate_match_score

GREENHOUSE_API_KEY = os.getenv("GREENHOUSE_API_KEY")
GREENHOUSE_BASE_URL = "https://harvest.greenhouse.io/v1"

def get_greenhouse_jobs() -> List[Dict]:
    """Fetch all jobs from Greenhouse."""
    if not GREENHOUSE_API_KEY:
        # Return mock data if API key is missing for development
        return [
            {"id": "gh-1", "name": "Software Engineer (Greenhouse Mock)"},
            {"id": "gh-2", "name": "Product Manager (Greenhouse Mock)"}
        ]
        
    headers = {
        "Authorization": f"Basic {GREENHOUSE_API_KEY}",
        "Content-Type": "application/json"
    }
    response = requests.get(
        f"{GREENHOUSE_BASE_URL}/jobs",
        headers=headers
    )
    response.raise_for_status()
    return response.json().get("jobs", [])

def create_greenhouse_candidate(candidate_data: Dict) -> Dict:
    """Create a candidate in Greenhouse."""
    if not GREENHOUSE_API_KEY:
        # Mock response
        return {"id": "gh-cand-mock-123", "status": "created (mock)"}

    headers = {
        "Authorization": f"Basic {GREENHOUSE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "first_name": candidate_data.get("first_name"),
        "last_name": candidate_data.get("last_name"),
        "email": candidate_data.get("email"),
        "phone": candidate_data.get("phone"),
        "notes": f"ProofHire Match Score: {candidate_data.get('fit_score', 0)}%",
        "tags": ["proofhire", f"match-score:{candidate_data.get('fit_score', 0)}"],
        "custom_fields": {
            "proofhire_profile": candidate_data.get("profile_url"),
            "skills": candidate_data.get("skills", [])
        }
    }
    response = requests.post(
        f"{GREENHOUSE_BASE_URL}/candidates",
        headers=headers,
        json=payload
    )
    response.raise_for_status()
    return response.json()

def add_to_greenhouse_job(greenhouse_candidate_id: str, greenhouse_job_id: str):
    """Add a candidate to a job in Greenhouse."""
    if not GREENHOUSE_API_KEY:
        return {"status": "added to job (mock)"}
        
    headers = {
        "Authorization": f"Basic {GREENHOUSE_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "job_id": greenhouse_job_id
    }
    response = requests.post(
        f"{GREENHOUSE_BASE_URL}/candidates/{greenhouse_candidate_id}/applications",
        headers=headers,
        json=payload
    )
    response.raise_for_status()
    return response.json()

def sync_candidate_to_greenhouse(candidate_id: str, job_id: str, db: Session) -> Dict:
    """Sync a ProofHire candidate to Greenhouse."""
    # Get candidate data from ProofHire
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    job = db.query(Job).filter(Job.id == job_id).first()

    if not candidate or not job:
        raise ValueError("Candidate or job not found")

    # Get match data
    match_data = calculate_match_score(
        {"skills": candidate.skills, "experience": candidate.experience},
        {"required_skills": job.required_skills, "nice_to_have_skills": job.nice_to_have_skills},
        db=db
    )

    # Prepare candidate data for Greenhouse
    candidate_data = {
        "first_name": candidate.name.split()[0] if candidate.name else "Unknown",
        "last_name": candidate.name.split()[-1] if candidate.name and len(candidate.name.split()) > 1 else "",
        "email": candidate.email,
        "fit_score": match_data["fit_score"],
        "skills": [s.name for s in candidate.skills] if isinstance(candidate.skills, list) and hasattr(candidate.skills[0], 'name') else candidate.skills,
        "profile_url": f"https://proofhire.vercel.app/profile/{candidate_id}"
    }

    # Create candidate in Greenhouse
    greenhouse_candidate = create_greenhouse_candidate(candidate_data)

    # In a real scenario, the greenhouse_job_id would be stored in the Job model or passed from frontend
    # For now we use the ProofHire job_id as a placeholder or assume it maps to a GH ID
    gh_job_id = getattr(job, "greenhouse_id", "mock-gh-job-id")
    add_to_greenhouse_job(greenhouse_candidate["id"], gh_job_id)

    return {
        "proofhire_candidate_id": candidate_id,
        "greenhouse_candidate_id": greenhouse_candidate["id"],
        "match_data": match_data
    }
