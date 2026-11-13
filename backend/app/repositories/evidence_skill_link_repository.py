from backend.app.models.evidence_skill_link import EvidenceSkillLink
from backend.app.repositories.base_repository import BaseRepository


class EvidenceSkillLinkRepository(BaseRepository[EvidenceSkillLink]):
    pass


evidence_skill_link_repository = EvidenceSkillLinkRepository(EvidenceSkillLink)

