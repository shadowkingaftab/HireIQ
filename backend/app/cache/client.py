import logging
from typing import Any, Generic, Optional, TypeVar

from proofhire.backend.app.core.config import settings

logger = logging.getLogger(__name__)

T = TypeVar("T")


class CacheClient:
    def __init__(self, url: Optional[str] = None):
        self.url = url or settings.REDIS_URL
        self._client: Any = None

    async def connect(self) -> None:
        try:
            import redis.asyncio as redis
            self._client = redis.from_url(self.url, decode_responses=True)
            await self._client.ping()
            logger.info("Connected to Redis at %s", self.url)
        except Exception:
            logger.exception("Failed to connect to Redis")
            self._client = None

    async def get(self, key: str) -> Optional[str]:
        if not self._client:
            return None
        try:
            return await self._client.get(key)
        except Exception:
            logger.exception("Cache get failed for %s", key)
            return None

    async def set(self, key: str, value: str, ttl: Optional[int] = None) -> None:
        if not self._client:
            return
        try:
            if ttl:
                await self._client.setex(key, ttl, value)
            else:
                await self._client.set(key, value)
        except Exception:
            logger.exception("Cache set failed for %s", key)

    async def delete(self, key: str) -> None:
        if not self._client:
            return
        try:
            await self._client.delete(key)
        except Exception:
            logger.exception("Cache delete failed for %s", key)

    async def flush(self) -> None:
        if not self._client:
            return
        try:
            await self._client.flushdb()
        except Exception:
            logger.exception("Cache flush failed")

    async def close(self) -> None:
        if self._client:
            await self._client.close()
            self._client = None


cache_client = CacheClient()
