import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class Metrics:
    def __init__(self):
        self._counters: Dict[str, int] = {}
        self._gauges: Dict[str, float] = {}
        self._histograms: Dict[str, List[float]] = {}

    def increment(self, name: str, amount: int = 1, tags: Optional[Dict[str, str]] = None) -> None:
        key = self._make_key(name, tags)
        self._counters[key] = self._counters.get(key, 0) + amount

    def gauge(self, name: str, value: float, tags: Optional[Dict[str, str]] = None) -> None:
        key = self._make_key(name, tags)
        self._gauges[key] = value

    def histogram(self, name: str, value: float, tags: Optional[Dict[str, str]] = None) -> None:
        key = self._make_key(name, tags)
        self._histograms.setdefault(key, []).append(value)

    def snapshot(self) -> Dict[str, Any]:
        return {
            "counters": dict(self._counters),
            "gauges": dict(self._gauges),
            "histograms": {k: {"count": len(v), "sum": sum(v), "min": min(v), "max": max(v)} for k, v in self._histograms.items()},
        }

    def reset(self) -> None:
        self._counters.clear()
        self._gauges.clear()
        self._histograms.clear()

    @staticmethod
    def _make_key(name: str, tags: Optional[Dict[str, str]]) -> str:
        if tags:
            tag_str = ",".join(f"{k}={v}" for k, v in sorted(tags.items()))
            return f"{name}[{tag_str}]"
        return name


metrics = Metrics()
