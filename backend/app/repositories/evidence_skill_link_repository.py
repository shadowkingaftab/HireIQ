from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.evidence import EvidenceSkillLink

class EvidenceSkillLinkRepository(BaseRepository[EvidenceSkillLink]):
    pass


evidence_skill_link_repository = EvidenceSkillLinkRepository(EvidenceSkillLink)
