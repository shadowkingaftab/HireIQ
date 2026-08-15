from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.skill import Skill
from proofhire.backend.app.contracts.skill_graph import SkillBase, CoreModel

class SkillRepository(BaseRepository[Skill, SkillBase, Any]):
    def get_by_name(self, db: Session, *, name: str) -> Optional[Skill]:
        return db.query(Skill).filter(Skill.name == name).first()

    def get_by_category(self, db: Session, *, category: str) -> List[Skill]:
        return db.query(Skill).filter(Skill.category == category).all()

skill_repository = SkillRepository(Skill)
