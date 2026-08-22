import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class HealthResult:
    name: str
    healthy: bool
    details: Optional[Dict[str, Any]] = None


class HealthCheck(ABC):
    name: str = "unnamed"

    @abstractmethod
    async def check(self) -> HealthResult:
        raise NotImplementedError


class HealthChecks:
    def __init__(self):
        self._checks: Dict[str, HealthCheck] = {}

    def register(self, check: HealthCheck) -> None:
        self._checks[check.name] = check

    async def run_all(self) -> Dict[str, Any]:
        results: List[HealthResult] = []
        for check in self._checks.values():
            try:
                result = await check.check()
            except Exception as exc:
                logger.exception("Health check %s failed", check.name)
                result = HealthResult(name=check.name, healthy=False, details={"error": str(exc)})
            results.append(result)
        overall = all(r.healthy for r in results)
        return {
            "status": "healthy" if overall else "unhealthy",
            "checks": {r.name: {"healthy": r.healthy, "details": r.details or {}} for r in results},
        }

    def list_names(self) -> List[str]:
        return list(self._checks.keys())


health_checks = HealthChecks()
