import asyncio
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class BaseWorker:
    def __init__(self, name: str, queue: Optional[Any] = None):
        self.name = name
        self.queue = queue
        self._running = False

    async def start(self) -> None:
        self._running = True
        logger.info("Worker %s started", self.name)
        while self._running:
            try:
                task = await self._dequeue()
                if task:
                    await self._handle(task)
                else:
                    await asyncio.sleep(1)
            except asyncio.CancelledError:
                break
            except Exception:
                logger.exception("Worker %s error", self.name)
                await asyncio.sleep(5)

    async def stop(self) -> None:
        self._running = False
        logger.info("Worker %s stopping", self.name)

    async def _dequeue(self) -> Optional[Dict[str, Any]]:
        if self.queue is None:
            return None
        try:
            return await self.queue.pop(f"worker:{self.name}")
        except Exception:
            return None

    async def _handle(self, task: Dict[str, Any]) -> None:
        task_type = task.get("type")
        handler = getattr(self, f"handle_{task_type}", None)
        if handler is None:
            logger.warning("No handler for task type %s", task_type)
            return
        await handler(task)

    async def health(self) -> Dict[str, Any]:
        return {"name": self.name, "running": self._running}


worker = BaseWorker("main-worker")
