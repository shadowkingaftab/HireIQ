from typing import Any, Dict, Optional

class WeightManager:
    def __init__(self):
        self._weights: Dict[str, float] = {}

    def set(self, key: str, weight: float) -> None:
        self._weights[key] = weight

    def get(self, key: str, default: float = 0.0) -> float:
        return self._weights.get(key, default)

    def normalize(self) -> Dict[str, float]:
        total = sum(self._weights.values())
        if total == 0:
            return dict(self._weights)
        return {k: v / total for k, v in self._weights.items()}


weight_manager = WeightManager()
