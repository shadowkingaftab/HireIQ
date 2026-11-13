from typing import Any

from backend.app.models.evidence_snapshot import EvidenceSnapshot
from backend.app.repositories.base_repository import BaseRepository


class EvidenceSnapshotRepository(BaseRepository[Any]):
    pass


evidence_snapshot_repository = EvidenceSnapshotRepository(EvidenceSnapshot)

