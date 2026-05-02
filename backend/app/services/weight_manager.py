from ..models.feedback import HiringFeedback
from sqlalchemy.orm import Session
from collections import defaultdict

# Default skill weights
DEFAULT_SKILL_WEIGHTS = {
    "Python": 1.0,
    "Django": 0.9,
    "JavaScript": 1.0,
    "React": 1.0,
    "PostgreSQL": 0.9,
    "FastAPI": 1.0,
    "AWS": 0.8,
    "Docker": 0.8
}

def adjust_skill_weights(db: Session):
    """Adjust skill weights based on hiring feedback."""
    feedbacks = db.query(HiringFeedback).all()

    # Track which skills are associated with successful hires
    # In a real app, we'd join with candidate skills or job requirements
    # For now, we'll apply a general adjustment factor based on overall success
    skill_success = defaultdict(lambda: {"success": 0, "total": 0})

    for feedback in feedbacks:
        # Simplified logic: if feedback is positive, we assume the skills were relevant
        if feedback.hired and (feedback.performance_score or 0) >= 4:
            skill_success["general"]["success"] += 1
        skill_success["general"]["total"] += 1

    # Adjust weights
    new_weights = DEFAULT_SKILL_WEIGHTS.copy()
    
    # Calculate general success rate
    general_stats = skill_success.get("general")
    if general_stats and general_stats["total"] > 0:
        success_rate = general_stats["success"] / general_stats["total"]
        # Adjustment factor between 0.9 and 1.1 based on success rate
        adjustment = 0.9 + (0.2 * success_rate)
        
        for skill in new_weights:
            new_weights[skill] = round(new_weights[skill] * adjustment, 2)

    return new_weights

def get_skill_weights(db: Session):
    """Get current skill weights, adjusted by feedback."""
    return adjust_skill_weights(db)
