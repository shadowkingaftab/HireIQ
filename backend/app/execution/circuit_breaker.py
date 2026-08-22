import logging
from typing import Any, Callable, Optional

logger = logging.getLogger(__name__)


class CircuitBreaker:
    def __init__(self, failure_threshold: int = 5, recovery_timeout: float = 30.0):
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout
        self._failures = 0
        self._state = "closed"
        self._last_failure_time: Optional[float] = None

    async def call(self, func: Callable[..., Any], *args: Any, **kwargs: Any) -> Any:
        if self._state == "open":
            import time
            if self._last_failure_time and (time.time() - self._last_failure_time) > self.recovery_timeout:
                self._state = "half-open"
            else:
                raise RuntimeError("Circuit breaker is open")
        try:
            result = await func(*args, **kwargs)
            if self._state == "half-open":
                self._state = "closed"
                self._failures = 0
            return result
        except Exception as exc:
            self._failures += 1
            self._last_failure_time = __import__("time").time()
            if self._failures >= self.failure_threshold:
                self._state = "open"
                logger.error("Circuit breaker opened after %s failures", self._failures)
            raise exc


circuit_breaker = CircuitBreaker()
