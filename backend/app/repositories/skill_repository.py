from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.skill import Skill

class SkillRepository(BaseRepository[Skill]):
    pass


skill_repository = SkillRepository(Skill)
