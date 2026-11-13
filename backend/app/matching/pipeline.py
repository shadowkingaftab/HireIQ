from typing import Any, Dict

from backend.app.database import SessionLocal
from backend.app.matching.capability_matcher import capability_matcher
from backend.app.matching.semantic_matcher import semantic_matcher
from backend.app.models.candidate import Candidate
from backend.app.models.job import Job
from backend.app.services.matching_engine import matching_engine
from sqlalchemy.orm import Session


class MatchingPipeline:
    def execute(self, db: Session, *, job: Job, candidate: Candidate) -> Dict[str, Any]:
        candidate_skills: Any = candidate.skills_data or {}
        if isinstance(candidate_skills, dict):
            candidate_skills = candidate_skills.get("skills", list(candidate_skills.keys()))
        job_data: Dict[str, Any] = {"skills": job.ideal_skills or [], "description": job.description or ""}
        candidate_data = {"skills": candidate_skills or [], "description": ""}
        semantic_res = semantic_matcher.match(job=job_data, candidate=candidate_data)
        capability_res = capability_matcher.match(job=job_data, candidate=candidate_data)
        
        # Weighted average or more complex ensemble
        total_score = (semantic_res["score"] * 0.4) + (capability_res["score"] * 0.6)
        
        return {
            "score": total_score,
            "semantic": semantic_res,
            "capability": capability_res
        }

    async def run_for_job(self, job_id: int):
        """Compute match rankings for a job from the persisted candidate pool."""
        db = SessionLocal()
        try:
            job = db.query(Job).filter(Job.id == job_id).first()
            if job is None:
                return []
            candidates = db.query(Candidate).all()
            return matching_engine.rank_candidates(db, job=job, candidates=candidates)
        finally:
            db.close()

matching_pipeline = MatchingPipeline()

