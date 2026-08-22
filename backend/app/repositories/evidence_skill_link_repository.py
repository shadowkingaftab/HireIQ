from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.evidence import EvidenceSkillLink

class EvidenceSkillLinkRepository(BaseRepository[EvidenceSkillLink]):
    pass


evidence_skill_link_repository = EvidenceSkillLinkRepository(EvidenceSkillLink)

