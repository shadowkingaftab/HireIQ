import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class ScoringRule:
    rule_id: str
    name: str
    description: str
    weight: float
    active: bool = True
    metadata: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass
class ScoringVersion:
    version_id: str
    name: str
    rules: List[ScoringRule]
    active: bool = False
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ScoringGovernance:
    def __init__(self):
        self._versions: Dict[str, ScoringVersion] = {}
        self._active_version_id: Optional[str] = None

    def register_version(self, version: ScoringVersion) -> None:
        self._versions[version.version_id] = version
        if version.active:
            self._active_version_id = version.version_id
        logger.info("Registered scoring version %s", version.version_id)

    def activate(self, version_id: str) -> None:
        version = self._versions.get(version_id)
        if version is None:
            raise ValueError(f"Scoring version not found: {version_id}")
        for v in self._versions.values():
            v.active = v.version_id == version_id
        self._active_version_id = version_id
        logger.info("Activated scoring version %s", version_id)

    def get_active_rules(self) -> List[ScoringRule]:
        version = self._versions.get(self._active_version_id) if self._active_version_id else None
        if version is None:
            return []
        return [rule for rule in version.rules if rule.active]

    def get_active_version(self) -> Optional[ScoringVersion]:
        if self._active_version_id is None:
            return None
        return self._versions.get(self._active_version_id)


scoring_governance = ScoringGovernance()
