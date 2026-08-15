from typing import List
from sqlalchemy.orm import Session
from proofhire.backend.app.models.notification import AuditLog

class AuditRepository:
    def create_log(self, db: Session, *, actor_id: int, action: str, resource_type: str, resource_id: str) -> AuditLog:
        db_obj = AuditLog(
            actor_id=actor_id,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

audit_repository = AuditRepository()
