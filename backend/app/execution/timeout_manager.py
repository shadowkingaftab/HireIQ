import asyncio
import logging
from typing import Any, Awaitable, Callable, Optional

logger = logging.getLogger(__name__)


class TimeoutManager:
    def __init__(self, default_timeout: float = 30.0):
        self.default_timeout = default_timeout

    async def run(self, coro: Awaitable[Any], timeout: Optional[float] = None) -> Any:
        timeout = timeout or self.default_timeout
        try:
            return await asyncio.wait_for(coro, timeout=timeout)
        except asyncio.TimeoutError:
            logger.error("Task timed out after %ss", timeout)
            raise


timeout_manager = TimeoutManager()
