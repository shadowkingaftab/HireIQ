from typing import List, Optional
from sqlalchemy.orm import Session
from proofhire.backend.app.models.audit_log import AuditLog
from proofhire.backend.app.contracts.admin import AdminAction

class AuditService:
    def record_action(self, *, actor_id: int, action_type: str, resource_id: Optional[str] = None, details: Optional[dict] = None) -> AuditLog:
        db = None
        if db is None:
            return AuditLog(actor_id=actor_id, action=action_type, resource_id=resource_id, metadata=details or {})
        log = AuditLog(actor_id=actor_id, action=action_type, resource_id=resource_id, metadata=details or {})
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    def list_actions(self, db: Session, *, actor_id: Optional[int] = None) -> List[AuditLog]:
        query = db.query(AuditLog)
        if actor_id:
            query = query.filter(AuditLog.actor_id == actor_id)
        return query.all()


audit_service = AuditService()
