from typing import List, Optional

from backend.app.contracts.applications import ApplicationCreate, ApplicationUpdate
from backend.app.models.application import Application
from backend.app.models.job import Job
from backend.app.repositories.application_repository import application_repository
from sqlalchemy.orm import Session


class ApplicationService:
    def get(self, db: Session, *, application_id: int) -> Optional[Application]:
        return application_repository.get(db, id=application_id)

    def apply(self, db: Session, *, app_in: ApplicationCreate) -> Application:
        # Trigger matching or notification workflows here
        return application_repository.create(db, obj_in=app_in)

    def create(self, db: Session, *, app_in: ApplicationCreate) -> Application:
        return self.apply(db, app_in=app_in)

    def update(self, db: Session, *, application_id: int, app_in: ApplicationUpdate) -> Optional[Application]:
        db_obj = application_repository.get(db, id=application_id)
        if db_obj is None:
            return None
        values = app_in.model_dump(exclude_unset=True) if hasattr(app_in, "model_dump") else app_in.dict(exclude_unset=True)
        return application_repository.update(db, db_obj=db_obj, obj_in=values)

    def update_status(self, db: Session, *, application_id: int, status: str) -> Optional[Application]:
        db_obj = application_repository.get(db, id=application_id)
        if db_obj is None:
            return None
        # Update logic
        return application_repository.update(db, db_obj=db_obj, obj_in={"status": status})

    def list(self, db: Session) -> List[Application]:
        return application_repository.list(db)

    def list_for_candidate(self, db: Session, *, candidate_id: int) -> List[Application]:
        return db.query(Application).filter(Application.candidate_id == candidate_id).all()

    def list_for_recruiter(self, db: Session, *, recruiter_id: int) -> List[Application]:
        return db.query(Application).join(Job).filter(Job.recruiter_id == recruiter_id).all()

application_service = ApplicationService()


