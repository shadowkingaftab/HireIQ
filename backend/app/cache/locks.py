import asyncio
import logging
import time
from typing import Optional

from proofhire.backend.app.cache.client import cache_client
from proofhire.backend.app.cache.keys import CacheKeys

logger = logging.getLogger(__name__)


class Lock:
    def __init__(self, key: str, ttl: int = 30):
        self.key = CacheKeys.rate_limit(f"lock:{key}")
        self.ttl = ttl
        self._acquired = False

    async def acquire(self) -> bool:
        try:
            acquired = await cache_client._client.set(self.key, "1", nx=True, ex=self.ttl)
            self._acquired = bool(acquired)
            return self._acquired
        except Exception:
            logger.exception("Lock acquire failed for %s", self.key)
            return False

    async def release(self) -> None:
        if not self._acquired:
            return
        try:
            await cache_client.delete(self.key)
            self._acquired = False
        except Exception:
            logger.exception("Lock release failed for %s", self.key)

    async def __aenter__(self) -> "Lock":
        await self.acquire()
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        await self.release()


async def with_lock(key: str, coro_func, ttl: int = 30):
    lock = Lock(key=key, ttl=ttl)
    acquired = await lock.acquire()
    if not acquired:
        raise RuntimeError(f"Could not acquire lock for {key}")
    try:
        return await coro_func()
    finally:
        await lock.release()
