import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class DecisionRecord:
    decision_id: str
    entity_type: str
    entity_id: str
    actor_id: Optional[str]
    action: str
    reason: Optional[str] = None
    context: Dict[str, Any] = field(default_factory=dict)
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class DecisionAudit:
    def __init__(self):
        self._records: List[DecisionRecord] = []

    def record(
        self,
        decision_id: str,
        entity_type: str,
        entity_id: str,
        action: str,
        actor_id: Optional[str] = None,
        reason: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> DecisionRecord:
        record = DecisionRecord(
            decision_id=decision_id,
            entity_type=entity_type,
            entity_id=entity_id,
            actor_id=actor_id,
            action=action,
            reason=reason,
            context=context or {},
        )
        self._records.append(record)
        logger.debug("Audit decision recorded: %s %s", action, entity_id)
        return record

    def get_records(
        self,
        entity_type: Optional[str] = None,
        entity_id: Optional[str] = None,
        action: Optional[str] = None,
        limit: int = 100,
    ) -> List[DecisionRecord]:
        records = self._records
        if entity_type:
            records = [r for r in records if r.entity_type == entity_type]
        if entity_id:
            records = [r for r in records if r.entity_id == entity_id]
        if action:
            records = [r for r in records if r.action == action]
        return records[-limit:]

    def to_dicts(self, **filters: Any) -> List[Dict[str, Any]]:
        records = self.get_records(**filters)
        return [
            {
                "decision_id": r.decision_id,
                "entity_type": r.entity_type,
                "entity_id": r.entity_id,
                "actor_id": r.actor_id,
                "action": r.action,
                "reason": r.reason,
                "context": r.context,
                "created_at": r.created_at,
            }
            for r in records
        ]


decision_audit = DecisionAudit()
