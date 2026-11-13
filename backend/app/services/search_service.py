from typing import Any, Dict, List

from backend.app.models.candidate import Candidate
from backend.app.models.job import Job
from backend.app.models.user import User
from sqlalchemy import or_
from sqlalchemy.orm import Session


class SearchService:
    def global_search(
        self, db: Session, *, query: str, types: List[str], limit: int = 10
    ) -> List[Dict[str, Any]]:
        term = f"%{query.strip()}%"
        results: List[Dict[str, Any]] = []
        if "job" in types:
            jobs = (
                db.query(Job)
                .filter(or_(Job.title.ilike(term), Job.description.ilike(term)))
                .limit(limit)
                .all()
            )
            results.extend(
                {"id": str(job.id), "type": "job", "score": 1.0,
                 "data": {"title": job.title, "description": job.description,
                          "organization_id": job.organization_id}}
                for job in jobs
            )
        if "candidate" in types and len(results) < limit:
            candidates = (
                db.query(Candidate)
                .join(User, Candidate.user_id == User.id)
                .filter(or_(User.full_name.ilike(term), User.email.ilike(term)))
                .limit(limit - len(results))
                .all()
            )
            results.extend(
                {"id": str(candidate.id), "type": "candidate", "score": 1.0,
                 "data": {"full_name": candidate.user.full_name,
                          "summary": candidate.summary}}
                for candidate in candidates
            )
        return results[:limit]

search_service = SearchService()

