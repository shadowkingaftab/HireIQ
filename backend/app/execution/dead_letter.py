import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class DeadLetterQueue:
    def __init__(self):
        self._items: List[Dict[str, Any]] = []

    def enqueue(self, item: Dict[str, Any]) -> None:
        self._items.append(item)
        logger.warning("Dead letter enqueued: %s", item.get("task_id"))

    def dequeue(self) -> Optional[Dict[str, Any]]:
        if not self._items:
            return None
        return self._items.pop(0)

    def drain(self) -> List[Dict[str, Any]]:
        items = list(self._items)
        self._items.clear()
        return items


dead_letter = DeadLetterQueue()
