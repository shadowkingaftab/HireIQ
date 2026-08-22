import json
from typing import Any, Optional

from proofhire.backend.app.cache.client import cache_client
from proofhire.backend.app.cache.keys import CacheKeys


class CacheSerializer:
    @staticmethod
    def serialize(value: Any) -> str:
        return json.dumps(value, default=str)

    @staticmethod
    def deserialize(raw: Optional[str]) -> Any:
        if not raw:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return raw


class Cached:
    def __init__(self, ttl: int = 300):
        self.ttl = ttl

    async def get(self, key: str) -> Any:
        raw = await cache_client.get(key)
        return CacheSerializer.deserialize(raw)

    async def set(self, key: str, value: Any) -> None:
        await cache_client.set(key, CacheSerializer.serialize(value), ttl=self.ttl)

    async def delete(self, key: str) -> None:
        await cache_client.delete(key)

    def candidate_key(self, candidate_id: str) -> str:
        return CacheKeys.candidate(candidate_id)

    def job_key(self, job_id: str) -> str:
        return CacheKeys.job(job_id)
