import logging
import time
from typing import Callable, Dict, Optional

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from proofhire.backend.app.core.exceptions import AppError

logger = logging.getLogger(__name__)


class RateLimitingMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, redis_client: Optional[Any] = None, default_limit: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.redis_client = redis_client
        self.default_limit = default_limit
        self.window_seconds = window_seconds

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        if self.redis_client is None:
            return await call_next(request)
        key = self._key(request)
        allowed, remaining, retry_after = await self._check_rate_limit(key)
        if not allowed:
            response = JSONResponse(
                status_code=429,
                content={"error": {"message": "Too many requests", "code": "RATE_LIMITED", "details": {"retry_after": retry_after}}},
            )
            response.headers["Retry-After"] = str(retry_after)
            return response
        response = await call_next(request)
        response.headers["X-RateLimit-Limit"] = str(self.default_limit)
        response.headers["X-RateLimit-Remaining"] = str(remaining)
        return response

    def _key(self, request: Request) -> str:
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return f"rate_limit:{forwarded.split(',')[0].strip()}"
        client = request.client
        return f"rate_limit:{client.host if client else 'unknown'}"

    async def _check_rate_limit(self, key: str) -> tuple:
        now = int(time.time())
        window_start = now - (now % self.window_seconds)
        count_key = f"{key}:{window_start}"
        try:
            count = await self.redis_client.incr(count_key)
            if count == 1:
                await self.redis_client.expire(count_key, self.window_seconds)
            remaining = max(self.default_limit - count, 0)
            if count > self.default_limit:
                retry_after = self.window_seconds - (now - window_start)
                return False, 0, retry_after
            return True, remaining, 0
        except Exception:
            logger.exception("Rate limit check failed for %s", key)
            return True, self.default_limit, 0
