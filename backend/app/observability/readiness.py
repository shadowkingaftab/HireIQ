import logging
from typing import Any, Dict

from proofhire.backend.app.observability.health_checks import HealthCheck, HealthResult, health_checks

logger = logging.getLogger(__name__)


class ReadinessCheck(HealthCheck):
    name = "readiness"

    def __init__(self, db: Any = None, cache_client: Any = None):
        self.db = db
        self.cache_client = cache_client

    async def check(self) -> HealthResult:
        details: Dict[str, Any] = {}
        if self.db is not None:
            try:
                await self.db.execute("SELECT 1")
                details["database"] = "ok"
            except Exception as exc:
                details["database"] = f"error: {exc}"
                return HealthResult(name=self.name, healthy=False, details=details)
        if self.cache_client is not None:
            try:
                await self.cache_client._client.ping()
                details["cache"] = "ok"
            except Exception as exc:
                details["cache"] = f"error: {exc}"
                return HealthResult(name=self.name, healthy=False, details=details)
        return HealthResult(name=self.name, healthy=True, details=details)


class ReadinessProbe:
    def __init__(self, check: Optional[ReadinessCheck] = None):
        self.check = check or ReadinessCheck()

    async def is_ready(self) -> bool:
        result = await self.check.check()
        return result.healthy

    async def response(self) -> Dict[str, Any]:
        return await health_checks.run_all()


readiness = ReadinessProbe()
