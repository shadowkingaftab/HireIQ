import asyncio
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class RateLimiter:
    def __init__(self, rate_limit: int = 100, period: int = 60):
        self.rate_limit = rate_limit
        self.period = period
        self._buckets: Dict[str, Dict[str, Any]] = {}

    async def allow(self, key: str) -> bool:
        now = asyncio.get_event_loop().time()
        bucket = self._buckets.get(key, {"count": 0, "reset_at": now + self.period})
        if now > bucket["reset_at"]:
            bucket = {"count": 0, "reset_at": now + self.period}
        if bucket["count"] >= self.rate_limit:
            return False
        bucket["count"] += 1
        self._buckets[key] = bucket
        return True


rate_limiter = RateLimiter()
