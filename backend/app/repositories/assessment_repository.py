from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.assessment import Assessment

class AssessmentRepository(BaseRepository[Assessment]):
    pass


assessment_repository = AssessmentRepository(Assessment)
