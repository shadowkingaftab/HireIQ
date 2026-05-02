from ..models.endorsement import Endorsement
from sqlalchemy.orm import Session

def add_endorsement(db: Session, candidate_id: str, endorser_id: str, skill_id: str):
    """Add a new endorsement."""
    endorsement = Endorsement(
        candidate_id=candidate_id,
        endorser_id=endorser_id,
        skill_id=skill_id
    )
    db.add(endorsement)
    db.commit()
    db.refresh(endorsement)
    return endorsement

def get_endorsements(db: Session, candidate_id: str):
    """Get all endorsements for a candidate."""
    return db.query(Endorsement).filter(Endorsement.candidate_id == candidate_id).all()
