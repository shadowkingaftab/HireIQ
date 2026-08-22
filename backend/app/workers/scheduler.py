import asyncio
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class TaskScheduler:
    def __init__(self):
        self._jobs: Dict[str, Any] = {}

    def schedule_cron(self, task_name: str, cron_expr: str, coroutine, **kwargs) -> None:
        self._jobs[task_name] = {"cron": cron_expr, "coroutine": coroutine, "kwargs": kwargs}
        logger.info("Scheduled cron task %s", task_name)

    async def run_pending(self) -> None:
        for name, job in self._jobs.items():
            try:
                await job["coroutine"](**job["kwargs"])
            except Exception:
                logger.exception("Scheduled task %s failed", name)

    async def start_periodic(self, interval_seconds: int = 60) -> None:
        while True:
            await self.run_pending()
            await asyncio.sleep(interval_seconds)


scheduler = TaskScheduler()
