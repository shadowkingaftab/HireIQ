import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class CapabilityRules:
    def __init__(self):
        self._rules: Dict[str, List[Dict[str, Any]]] = {}

    def register_rule(self, capability: str, rule: Dict[str, Any]) -> None:
        self._rules.setdefault(capability, []).append(rule)

    def evaluate(self, capability: str, context: Dict[str, Any]) -> Dict[str, Any]:
        rules = self._rules.get(capability, [])
        for rule in rules:
            if self._matches(rule, context):
                return {"capability": capability, "matched_rule": rule, "confidence": rule.get("confidence", 0.5)}
        return {"capability": capability, "matched_rule": None, "confidence": 0.0}

    def _matches(self, rule: Dict[str, Any], context: Dict[str, Any]) -> bool:
        conditions = rule.get("conditions", {})
        for key, value in conditions.items():
            if context.get(key) != value:
                return False
        return True


capability_rules = CapabilityRules()
