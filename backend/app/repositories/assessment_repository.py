from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.assessment import Assessment

class AssessmentRepository(BaseRepository[Assessment]):
    pass


assessment_repository = AssessmentRepository(Assessment)

