import asyncio
import time
from typing import Dict

class IntegrationRateLimiter:
    def __init__(self, requests_per_minute: int):
        self.interval = 60.0 / requests_per_minute
        self.last_request_time = 0.0

    async def wait(self):
        now = time.time()
        elapsed = now - self.last_request_time
        if elapsed < self.interval:
            await asyncio.sleep(self.interval - elapsed)
        self.last_request_time = time.time()
