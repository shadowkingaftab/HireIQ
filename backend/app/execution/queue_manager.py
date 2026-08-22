import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class QueueManager:
    def __init__(self, queue_client: Optional[Any] = None):
        self.queue_client = queue_client

    async def push(self, queue_name: str, payload: Dict[str, Any]) -> None:
        if self.queue_client is None:
            logger.debug("Queue push for %s: %s", queue_name, payload)
            return
        try:
            await self.queue_client.push(queue_name, payload)
        except Exception:
            logger.exception("Queue push failed for %s", queue_name)

    async def pop(self, queue_name: str) -> Dict[str, Any]:
        if self.queue_client is None:
            return {}
        try:
            return await self.queue_client.pop(queue_name)
        except Exception:
            logger.exception("Queue pop failed for %s", queue_name)
            return {}


queue_manager = QueueManager()
