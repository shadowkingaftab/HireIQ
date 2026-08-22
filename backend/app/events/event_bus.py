import asyncio
import logging
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


class Event:
    def __init__(self, event_type: str, entity_type: str, entity_id: str, data: Optional[Dict[str, Any]] = None, metadata: Optional[Dict[str, Any]] = None):
        self.event_type = event_type
        self.entity_type = entity_type
        self.entity_id = entity_id
        self.data = data or {}
        self.metadata = metadata or {}
        self.timestamp = datetime.now(timezone.utc).isoformat()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "event_type": self.event_type,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "data": self.data,
            "metadata": self.metadata,
            "timestamp": self.timestamp,
        }


class EventBus:
    def __init__(self):
        self._subscribers: Dict[str, List[Callable[[Event], Any]]] = defaultdict(list)
        self._global_subscribers: List[Callable[[Event], Any]] = []
        self._history: List[Event] = []
        self._max_history = 1000

    def subscribe(self, event_type: str, handler: Callable[[Event], Any]) -> None:
        self._subscribers[event_type].append(handler)

    def subscribe_all(self, handler: Callable[[Event], Any]) -> None:
        self._global_subscribers.append(handler)

    async def publish(self, event: Event) -> None:
        self._history.append(event)
        if len(self._history) > self._max_history:
            self._history = self._history[-self._max_history:]
        handlers = list(self._subscribers.get(event.event_type, []))
        handlers.extend(self._global_subscribers)
        if not handlers:
            return
        tasks = [self._safe_call(handler, event) for handler in handlers]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        for result in results:
            if isinstance(result, Exception):
                logger.exception("Event handler failed")

    def history(self, event_type: Optional[str] = None, limit: int = 100) -> List[Event]:
        events = self._history
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        return events[-limit:]

    async def _safe_call(self, handler: Callable[[Event], Any], event: Event) -> None:
        try:
            result = handler(event)
            if asyncio.iscoroutine(result):
                await result
        except Exception:
            logger.exception("Handler failed for event %s", event.event_type)
            raise


event_bus = EventBus()
