import logging
import time
from typing import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()
        method = request.method
        path = request.url.path
        try:
            response = await call_next(request)
            duration_ms = (time.perf_counter() - start) * 1000
            logger.info("%s %s %s %s", method, path, response.status_code, round(duration_ms, 2))
            return response
        except Exception as exc:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.error("%s %s ERROR %s %s", method, path, str(exc), round(duration_ms, 2))
            raise
