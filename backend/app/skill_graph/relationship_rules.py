import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class RelationshipRules:
    def __init__(self):
        self._rules: List[Dict[str, Any]] = []

    def add_rule(self, source: str, target: str, relation: str, weight: float = 1.0) -> None:
        self._rules.append({"source": source, "target": target, "relation": relation, "weight": weight})

    def find_relations(self, skill: str) -> List[Dict[str, Any]]:
        return [r for r in self._rules if r["source"] == skill or r["target"] == skill]

    def related_skills(self, skill: str) -> List[str]:
        related = []
        for rule in self._rules:
            if rule["source"] == skill:
                related.append(rule["target"])
            elif rule["target"] == skill:
                related.append(rule["source"])
        return related


relationship_rules = RelationshipRules()
