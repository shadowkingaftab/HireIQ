import logging
from typing import Any, Dict, List, Optional

from proofhire.backend.app.events.event_bus import Event, EventBus, event_bus
from proofhire.backend.app.events.event_types import EventType

logger = logging.getLogger(__name__)


class EventPublisher:
    def __init__(self, bus: Optional[EventBus] = None):
        self.bus = bus or event_bus

    async def publish(self, event: Event) -> None:
        await self.bus.publish(event)

    async def candidate_created(self, candidate_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.CANDIDATE_CREATED.value, entity_type="candidate", entity_id=candidate_id, data=data))

    async def candidate_updated(self, candidate_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.CANDIDATE_UPDATED.value, entity_type="candidate", entity_id=candidate_id, data=data))

    async def evidence_ingested(self, evidence_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.EVIDENCE_INGESTED.value, entity_type="evidence", entity_id=evidence_id, data=data))

    async def capability_inferred(self, candidate_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.CAPABILITY_INFERRED.value, entity_type="candidate", entity_id=candidate_id, data=data))

    async def job_created(self, job_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.JOB_CREATED.value, entity_type="job", entity_id=job_id, data=data))

    async def job_updated(self, job_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.JOB_UPDATED.value, entity_type="job", entity_id=job_id, data=data))

    async def match_computed(self, match_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.MATCH_COMPUTED.value, entity_type="match", entity_id=match_id, data=data))

    async def assessment_started(self, assessment_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.ASSESSMENT_STARTED.value, entity_type="assessment", entity_id=assessment_id, data=data))

    async def assessment_completed(self, assessment_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.ASSESSMENT_COMPLETED.value, entity_type="assessment", entity_id=assessment_id, data=data))

    async def search_performed(self, query_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.SEARCH_PERFORMED.value, entity_type="search", entity_id=query_id, data=data))

    async def application_created(self, application_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.APPLICATION_CREATED.value, entity_type="application", entity_id=application_id, data=data))

    async def application_status_changed(self, application_id: str, data: Optional[Dict[str, Any]] = None) -> None:
        await self.publish(Event(event_type=EventType.APPLICATION_STATUS_CHANGED.value, entity_type="application", entity_id=application_id, data=data))


publishers = EventPublisher()
