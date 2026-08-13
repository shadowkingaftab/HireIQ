from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel, TimestampModel

class SkillBase(CoreModel):
    name: str
    category: Optional[str] = None

class SkillNode(SkillBase):
    id: str
    related_skills: List[str] = []

class SkillGraphQuery(CoreModel):
    skill_names: List[str]
    depth: int = 1
