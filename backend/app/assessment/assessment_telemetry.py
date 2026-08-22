import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class AssessmentTelemetry:
    def __init__(self):
        self._events: List[Dict[str, Any]] = []

    def record(self, *, attempt_id: int, event_type: str, payload: Dict[str, Any]) -> None:
        event = {"attempt_id": attempt_id, "type": event_type, "payload": payload, "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat()}
        self._events.append(event)

    def for_attempt(self, attempt_id: int) -> List[Dict[str, Any]]:
        return [e for e in self._events if e["attempt_id"] == attempt_id]

    def clear(self) -> None:
        self._events.clear()


assessment_telemetry = AssessmentTelemetry()
