from enum import Enum


class EventType(str, Enum):
    CANDIDATE_CREATED = "candidate.created"
    CANDIDATE_UPDATED = "candidate.updated"
    EVIDENCE_INGESTED = "evidence.ingested"
    CAPABILITY_INFERRED = "capability.inferred"
    JOB_CREATED = "job.created"
    JOB_UPDATED = "job.updated"
    MATCH_COMPUTED = "match.computed"
    ASSESSMENT_STARTED = "assessment.started"
    ASSESSMENT_COMPLETED = "assessment.completed"
    SEARCH_PERFORMED = "search.performed"
    APPLICATION_CREATED = "application.created"
    APPLICATION_STATUS_CHANGED = "application.status_changed"

    @classmethod
    def values(cls) -> list[str]:
        return [event.value for event in cls]


class EventTypes:
    CANDIDATE_CREATED = EventType.CANDIDATE_CREATED
    CANDIDATE_UPDATED = EventType.CANDIDATE_UPDATED
    EVIDENCE_INGESTED = EventType.EVIDENCE_INGESTED
    CAPABILITY_INFERRED = EventType.CAPABILITY_INFERRED
    JOB_CREATED = EventType.JOB_CREATED
    JOB_UPDATED = EventType.JOB_UPDATED
    MATCH_COMPUTED = EventType.MATCH_COMPUTED
    ASSESSMENT_STARTED = EventType.ASSESSMENT_STARTED
    ASSESSMENT_COMPLETED = EventType.ASSESSMENT_COMPLETED
    SEARCH_PERFORMED = EventType.SEARCH_PERFORMED
    APPLICATION_CREATED = EventType.APPLICATION_CREATED
    APPLICATION_STATUS_CHANGED = EventType.APPLICATION_STATUS_CHANGED

    @classmethod
    def values(cls) -> list[str]:
        return EventType.values()
