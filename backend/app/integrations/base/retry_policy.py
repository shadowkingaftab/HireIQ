import asyncio
import logging
from typing import Any, Callable, Dict, Optional

logger = logging.getLogger(__name__)


class RetryPolicy:
    def __init__(self, max_attempts: int = 3, base_delay: float = 1.0):
        self.max_attempts = max_attempts
        self.base_delay = base_delay

    async def execute(self, func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
        last_exception: Optional[Exception] = None
        for attempt in range(1, self.max_attempts + 1):
            try:
                return await func(*args, **kwargs)
            except Exception as exc:
                last_exception = exc
                logger.warning("Attempt %s failed: %s", attempt, exc)
                if attempt < self.max_attempts:
                    await asyncio.sleep(self.base_delay * (2 ** (attempt - 1)))
        raise last_exception or RuntimeError("Retry failed")


retry_policy = RetryPolicy()
