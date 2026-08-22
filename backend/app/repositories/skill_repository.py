from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.skill import Skill

class SkillRepository(BaseRepository[Skill]):
    pass


skill_repository = SkillRepository(Skill)

