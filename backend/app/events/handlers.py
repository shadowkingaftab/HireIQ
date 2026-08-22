import logging
from typing import Any, Dict

from proofhire.backend.app.events.event_bus import Event, event_bus
from proofhire.backend.app.events.event_types import EventType

logger = logging.getLogger(__name__)


def log_event_handler(event: Event) -> None:
    logger.info("Event %s for %s %s", event.event_type, event.entity_type, event.entity_id)


def register_default_handlers() -> None:
    event_bus.subscribe_all(log_event_handler)

    event_bus.subscribe(EventType.CANDIDATE_CREATED.value, _handle_candidate_created)
    event_bus.subscribe(EventType.EVIDENCE_INGESTED.value, _handle_evidence_ingested)
    event_bus.subscribe(EventType.MATCH_COMPUTED.value, _handle_match_computed)
    event_bus.subscribe(EventType.ASSESSMENT_COMPLETED.value, _handle_assessment_completed)


def _handle_candidate_created(event: Event) -> None:
    logger.debug("Handling candidate created: %s", event.entity_id)


def _handle_evidence_ingested(event: Event) -> None:
    logger.debug("Handling evidence ingested: %s", event.entity_id)


def _handle_match_computed(event: Event) -> None:
    logger.debug("Handling match computed: %s", event.entity_id)


def _handle_assessment_completed(event: Event) -> None:
    logger.debug("Handling assessment completed: %s", event.entity_id)
