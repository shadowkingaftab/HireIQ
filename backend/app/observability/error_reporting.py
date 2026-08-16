import logging
import traceback
from typing import Any, Dict, List, Optional

from proofhire.backend.app.core.config import settings

logger = logging.getLogger(__name__)


class ErrorReporting:
    def __init__(self, enabled: bool = False):
        self.enabled = enabled
        self._buffer: List[Dict[str, Any]] = []
        self._max_buffer = 100

    async def capture(self, exc: BaseException, context: Optional[Dict[str, Any]] = None) -> None:
        record = {
            "exception": str(exc),
            "type": type(exc).__name__,
            "traceback": traceback.format_exc(),
            "context": context or {},
            "timestamp": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        }
        self._buffer.append(record)
        if len(self._buffer) > self._max_buffer:
            self._buffer = self._buffer[-self._max_buffer:]
        if self.enabled:
            await self._send(record)
        else:
            logger.error("Captured error: %s", record["exception"])

    async def _send(self, record: Dict[str, Any]) -> None:
        try:
            import httpx
            payload = {
                "service": settings.PROJECT_NAME,
                "environment": "development",
                "error": record,
            }
            async with httpx.AsyncClient() as client:
                await client.post("https://example.com/errors", json=payload, timeout=5.0)
        except Exception:
            logger.exception("Failed to send error report")

    def buffer(self) -> List[Dict[str, Any]]:
        return list(self._buffer)

    def clear(self) -> None:
        self._buffer.clear()


error_reporting = ErrorReporting()
