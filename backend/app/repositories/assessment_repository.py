from backend.app.models.assessment import Assessment
from backend.app.repositories.base_repository import BaseRepository


class AssessmentRepository(BaseRepository[Assessment]):
    pass


assessment_repository = AssessmentRepository(Assessment)

