import logging
from typing import Any, Awaitable, Callable, Optional

logger = logging.getLogger(__name__)


class RetryManager:
    def __init__(self, max_attempts: int = 3, base_delay: float = 1.0):
        self.max_attempts = max_attempts
        self.base_delay = base_delay

    async def run(self, coro_factory: Callable[[], Awaitable[Any]], attempts: Optional[int] = None) -> Any:
        attempts = attempts or self.max_attempts
        last_exception: Optional[Exception] = None
        for attempt in range(1, attempts + 1):
            try:
                return await coro_factory()
            except Exception as exc:
                last_exception = exc
                logger.warning("Attempt %s failed: %s", attempt, exc)
                if attempt == attempts:
                    break
        raise last_exception or RuntimeError("Retry failed")


retry_manager = RetryManager()
