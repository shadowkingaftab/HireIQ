import logging
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


@dataclass
class RetentionRule:
    entity_type: str
    retention_days: int
    action: str = "delete"
    metadata: Dict[str, Any] = field(default_factory=dict)


class RetentionPolicy:
    def __init__(self):
        self._rules: Dict[str, RetentionRule] = {}

    def register_rule(self, rule: RetentionRule) -> None:
        self._rules[rule.entity_type] = rule
        logger.info("Registered retention rule for %s", rule.entity_type)

    def evaluate(self, entity_type: str, created_at: str) -> Optional[RetentionRule]:
        rule = self._rules.get(entity_type)
        if rule is None:
            return None
        try:
            dt = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            age_days = (now - dt).total_seconds() / 86400.0
            if age_days > rule.retention_days:
                return rule
        except Exception:
            logger.exception("Failed to evaluate retention for %s", entity_type)
        return None

    def list_rules(self) -> List[RetentionRule]:
        return list(self._rules.values())


retention_policy = RetentionPolicy()
