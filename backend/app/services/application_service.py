from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.application_repository import application_repository
from proofhire.backend.app.contracts.applications import ApplicationCreate, ApplicationUpdate
from proofhire.backend.app.models.application import Application

class ApplicationService:
    def apply(self, db: Session, *, app_in: ApplicationCreate) -> Application:
        # Trigger matching or notification workflows here
        return application_repository.create(db, obj_in=app_in)

    def update_status(self, db: Session, *, application_id: int, status: str) -> Application:
        db_obj = application_repository.get(db, id=application_id)
        # Update logic
        return application_repository.update(db, db_obj=db_obj, obj_in={"status": status})

application_service = ApplicationService()
