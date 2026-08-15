from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.assessment import Assessment
from proofhire.backend.app.contracts.assessments import AssessmentCreate, AssessmentUpdate

class AssessmentRepository(BaseRepository[Assessment, AssessmentCreate, AssessmentUpdate]):
    def get_by_organization(self, db: Session, *, organization_id: int) -> List[Assessment]:
        return db.query(Assessment).filter(Assessment.organization_id == organization_id).all()

assessment_repository = AssessmentRepository(Assessment)
