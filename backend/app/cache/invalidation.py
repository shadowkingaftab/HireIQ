import logging
from typing import Set

from backend.app.cache.client import cache_client
from backend.app.cache.keys import CacheKeys

logger = logging.getLogger(__name__)


class CacheInvalidation:
    def __init__(self):
        self._patterns: Set[str] = set()

    def register_pattern(self, pattern: str) -> None:
        self._patterns.add(pattern)

    async def invalidate(self, key: str) -> None:
        await cache_client.delete(key)
        logger.debug("Invalidated cache key %s", key)

    async def invalidate_pattern(self, pattern: str) -> None:
        if not cache_client._client:
            return
        try:
            keys = await cache_client._client.keys(pattern)
            if keys:
                await cache_client._client.delete(*keys)
                logger.debug("Invalidated %d keys matching %s", len(keys), pattern)
        except Exception:
            logger.exception("Pattern invalidation failed for %s", pattern)

    async def invalidate_candidate(self, candidate_id: str) -> None:
        await self.invalidate(CacheKeys.candidate(candidate_id))
        await self.invalidate_pattern(CacheKeys.search_results("*"))
        await self.invalidate_pattern(f"match:{candidate_id}:*")

    async def invalidate_job(self, job_id: str) -> None:
        await self.invalidate(CacheKeys.job(job_id))
        await self.invalidate_pattern(CacheKeys.search_results("*"))
        await self.invalidate_pattern(f"match:*:{job_id}")

    async def invalidate_search(self) -> None:
        await self.invalidate_pattern(CacheKeys.search_results("*"))


cache_invalidation = CacheInvalidation()

