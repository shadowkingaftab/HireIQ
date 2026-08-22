import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class AntiCheat:
    def detect_anomalies(self, *, telemetry: Dict[str, Any]) -> bool:
        events = telemetry.get("events", [])
        switches = sum(1 for e in events if e.get("type") == "window_switch")
        pastes = sum(1 for e in events if e.get("type") == "paste")
        if switches > 3 or pastes > 2:
            logger.warning("Anti-cheat anomalies detected: switches=%s pastes=%s", switches, pastes)
            return True
        return False

    def flag_attempt(self, *, attempt_id: int, reasons: List[str]) -> Dict[str, Any]:
        return {"attempt_id": attempt_id, "flagged": True, "reasons": reasons}


anti_cheat = AntiCheat()
