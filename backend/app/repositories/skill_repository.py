from backend.app.models.skill import Skill
from backend.app.repositories.base_repository import BaseRepository


class SkillRepository(BaseRepository[Skill]):
    pass


skill_repository = SkillRepository(Skill)

