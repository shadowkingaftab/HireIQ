from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.audit_repository import audit_repository

class AuditService:
    def log_action(self, db: Session, *, actor_id: int, action: str, resource_type: str, resource_id: str):
        return audit_repository.create_log(
            db, actor_id=actor_id, action=action, resource_type=resource_type, resource_id=resource_id
        )

audit_service = AuditService()
