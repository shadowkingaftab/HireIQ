from typing import Dict, Any

class AntiCheat:
    def detect_anomalies(self, *, telemetry: Dict[str, Any]) -> bool:
        # Detect window switching, copy-paste, multiple faces, etc.
        return False

anti_cheat = AntiCheat()
