from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.evidence import Evidence

class EvidenceSnapshotRepository(BaseRepository[Any]):
    pass


evidence_snapshot_repository = EvidenceSnapshotRepository(None)

