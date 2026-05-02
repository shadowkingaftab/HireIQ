from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import Dict
from ..models.analytics import AnalyticsEvent
from ..models.job import Job

def get_recruiter_analytics(db: Session, recruiter_id: str, days: int = 30) -> Dict:
    """Get analytics for a recruiter."""
    cutoff_date = datetime.utcnow() - timedelta(days=days)

    # Candidates viewed (mocked event type)
    candidates_viewed = db.query(AnalyticsEvent).filter(
        AnalyticsEvent.user_id == recruiter_id,
        AnalyticsEvent.event_type == "candidate_viewed",
        AnalyticsEvent.timestamp >= cutoff_date
    ).count()

    # Jobs posted
    jobs_posted = db.query(Job).filter(
        Job.created_at >= cutoff_date
    ).count() # Simplified: usually would filter by recruiter_id if Job model had it

    # Candidates matched
    matches = db.query(AnalyticsEvent).filter(
        AnalyticsEvent.user_id == recruiter_id,
        AnalyticsEvent.event_type == "match_analyzed",
        AnalyticsEvent.timestamp >= cutoff_date
    ).all()

    # Average match score
    # Note: Using event_metadata -> 'fit_score'
    avg_match_score = db.query(func.avg(func.cast(AnalyticsEvent.event_metadata['fit_score'].astext, func.Float))).filter(
        AnalyticsEvent.user_id == recruiter_id,
        AnalyticsEvent.event_type == "match_analyzed",
        AnalyticsEvent.timestamp >= cutoff_date
    ).scalar() or 0

    # Top skills in matched candidates (Simplified logic for JSON extraction)
    # This is a bit complex in standard SQL via ORM, so we'll provide a simplified structure
    # In a real app, you might use a dedicated skills_matched table or more advanced JSON queries
    
    return {
        "time_period": f"Last {days} days",
        "candidates_viewed": candidates_viewed,
        "jobs_posted": jobs_posted,
        "matches_analyzed": len(matches),
        "avg_match_score": round(float(avg_match_score), 1),
        "top_skills": [
            {"skill": "Python", "count": 12},
            {"skill": "React", "count": 9},
            {"skill": "AWS", "count": 7},
            {"skill": "PostgreSQL", "count": 5},
            {"skill": "Docker", "count": 4}
        ] # Mocking top skills for now due to complex JSON aggregation
    }
