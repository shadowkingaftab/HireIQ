from ..models.feedback import HiringFeedback, SurveyFeedback
from sqlalchemy.orm import Session

def add_feedback(db: Session, feedback_data: dict):
    """Add hiring feedback for a candidate."""
    feedback = HiringFeedback(**feedback_data)
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def add_survey_feedback(db: Session, feedback_data: dict):
    """Add general survey feedback from users."""
    feedback = SurveyFeedback(**feedback_data)
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

def get_feedback_for_candidate(db: Session, candidate_id: str):
    """Get all feedback for a candidate."""
    return db.query(HiringFeedback).filter(
        HiringFeedback.candidate_id == candidate_id
    ).all()

def get_feedback_for_job(db: Session, job_id: str):
    """Get all feedback for a job."""
    return db.query(HiringFeedback).filter(
        HiringFeedback.job_id == job_id
    ).all()
