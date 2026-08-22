from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.models.data_consent import DataConsent

class ConsentService:
    def grant(self, db: Session, *, user_id: int, purpose: str) -> DataConsent:
        db_obj = DataConsent(user_id=user_id, purpose=purpose, granted=True)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def revoke(self, db: Session, *, user_id: int, purpose: str) -> Optional[DataConsent]:
        db_obj = db.query(DataConsent).filter(DataConsent.user_id == user_id, DataConsent.purpose == purpose).first()
        if db_obj:
            db_obj.granted = False
            db.commit()
            db.refresh(db_obj)
        return db_obj


consent_service = ConsentService()
