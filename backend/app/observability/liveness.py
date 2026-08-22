import logging
from typing import Any, Dict

from proofhire.backend.app.observability.health_checks import HealthCheck, HealthResult, health_checks

logger = logging.getLogger(__name__)


class LivenessCheck(HealthCheck):
    name = "liveness"

    async def check(self) -> HealthResult:
        return HealthResult(name=self.name, healthy=True, details={"uptime": "ok"})


class LivenessProbe:
    def __init__(self, check: Optional[LivenessCheck] = None):
        self.check = check or LivenessCheck()
        health_checks.register(self.check)

    async def is_alive(self) -> bool:
        result = await self.check.check()
        return result.healthy

    async def response(self) -> Dict[str, Any]:
        return {"status": "alive" if await self.is_alive() else "dead"}


liveness = LivenessProbe()
