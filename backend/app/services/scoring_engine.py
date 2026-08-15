from typing import Dict, Any, List
from proofhire.backend.app.models.job import Job
from proofhire.backend.app.models.candidate import Candidate

class ScoringEngine:
    def calculate_score(self, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        # Placeholder for complex scoring logic
        job_skills = set(job.ideal_skills)
        candidate_skills = set(candidate.skills_data.get("skills", []))
        
        matched = list(job_skills.intersection(candidate_skills))
        missing = list(job_skills.difference(candidate_skills))
        
        score = 0.0
        if job_skills:
            score = (len(matched) / len(job_skills)) * 100
            
        return {
            "total_score": round(score, 2),
            "matched_skills": matched,
            "missing_skills": missing,
            "reasoning": f"Matched {len(matched)} out of {len(job_skills)} required skills."
        }

scoring_engine = ScoringEngine()
