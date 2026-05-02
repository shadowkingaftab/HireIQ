from ..models.analytics import AnalyticsEvent
from sqlalchemy.orm import Session
from datetime import datetime, timedelta

def track_event(db: Session, event_type: str, user_id: str = None, event_metadata: dict = None):
    """Track a user event for analytics."""
    event = AnalyticsEvent(
        user_id=user_id,
        event_type=event_type,
        event_metadata=event_metadata
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event

def track_funnel_step(db: Session, step: str, funnel: str = "main", user_id: str = None):
    """Track a step in a conversion funnel."""
    return track_event(db, f"funnel:{funnel}:{step}", user_id, {
        "funnel": funnel,
        "step": step
    })

def get_analytics(db: Session, event_type: str = None, days: int = 7):
    """Get analytics data for a given period."""
    query = db.query(AnalyticsEvent)
    if event_type:
        query = query.filter(AnalyticsEvent.event_type == event_type)

    cutoff_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(AnalyticsEvent.timestamp >= cutoff_date)

    return query.all()
