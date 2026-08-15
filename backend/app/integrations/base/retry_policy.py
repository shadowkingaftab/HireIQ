from typing import Callable, Any
import asyncio

class RetryPolicy:
    def __init__(self, max_retries: int = 3, backoff_factor: float = 2.0):
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor

    async def execute(self, func: Callable, *args, **kwargs) -> Any:
        retries = 0
        while retries < self.max_retries:
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                retries += 1
                if retries == self.max_retries:
                    raise e
                await asyncio.sleep(self.backoff_factor ** retries)
