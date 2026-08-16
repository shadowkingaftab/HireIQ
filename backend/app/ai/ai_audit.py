import logging
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from proofhire.backend.app.ai.hallucination_guard import HallucinationGuard
from proofhire.backend.app.ai.citation_builder import CitationBuilder

logger = logging.getLogger(__name__)


@dataclass
class AuditEvent:
    timestamp: str
    event_type: str
    entity_type: str
    entity_id: str
    model: Optional[str] = None
    prompt: Optional[str] = None
    response: Optional[str] = None
    citations: List[Dict[str, Any]] = field(default_factory=list)
    hallucination_checks: List[Dict[str, Any]] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)


class AIAudit:
    def __init__(self, guard: Optional[HallucinationGuard] = None, citation_builder: Optional[CitationBuilder] = None):
        self.guard = guard or HallucinationGuard()
        self.citation_builder = citation_builder or CitationBuilder()
        self._events: List[AuditEvent] = []

    def record(
        self,
        event_type: str,
        entity_type: str,
        entity_id: str,
        model: Optional[str] = None,
        prompt: Optional[str] = None,
        response: Optional[str] = None,
        source_ids: Optional[List[str]] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> AuditEvent:
        citations = []
        if source_ids and response:
            citations = self.citation_builder.build_citations_for_claim(claim=response, source_ids=source_ids)

        hallucination_checks = []
        if response and citations:
            evidence_text = " ".join(c.get("excerpt", "") for c in citations)
            check = self.guard.check(claim=response, evidence=evidence_text)
            hallucination_checks.append(check)

        event = AuditEvent(
            timestamp=datetime.now(timezone.utc).isoformat(),
            event_type=event_type,
            entity_type=entity_type,
            entity_id=entity_id,
            model=model,
            prompt=prompt,
            response=response,
            citations=citations,
            hallucination_checks=hallucination_checks,
            metadata=metadata or {},
        )
        self._events.append(event)
        logger.debug("Audit event recorded: %s %s", event_type, entity_id)
        return event

    def get_events(self, entity_id: Optional[str] = None, event_type: Optional[str] = None) -> List[AuditEvent]:
        events = self._events
        if entity_id:
            events = [e for e in events if e.entity_id == entity_id]
        if event_type:
            events = [e for e in events if e.event_type == event_type]
        return events

    def to_dicts(self, entity_id: Optional[str] = None) -> List[Dict[str, Any]]:
        return [self._event_to_dict(e) for e in self.get_events(entity_id=entity_id)]

    def _event_to_dict(self, event: AuditEvent) -> Dict[str, Any]:
        return {
            "timestamp": event.timestamp,
            "event_type": event.event_type,
            "entity_type": event.entity_type,
            "entity_id": event.entity_id,
            "model": event.model,
            "prompt": event.prompt,
            "response": event.response,
            "citations": event.citations,
            "hallucination_checks": event.hallucination_checks,
            "metadata": event.metadata,
        }


ai_audit = AIAudit()
