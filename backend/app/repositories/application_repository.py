from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.application import Application
from proofhire.backend.app.contracts.applications import ApplicationCreate, ApplicationUpdate

class ApplicationRepository(BaseRepository[Application, ApplicationCreate, ApplicationUpdate]):
    def get_by_job(
        self, db: Session, *, job_id: int, skip: int = 0, limit: int = 100
    ) -> List[Application]:
        return (
            db.query(Application)
            .filter(Application.job_id == job_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_candidate(
        self, db: Session, *, candidate_id: int, skip: int = 0, limit: int = 100
    ) -> List[Application]:
        return (
            db.query(Application)
            .filter(Application.candidate_id == candidate_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

application_repository = ApplicationRepository(Application)
