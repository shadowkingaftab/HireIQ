from sqlalchemy.orm import Session
from proofhire.backend.app.repositories.base_repository import BaseRepository
from proofhire.backend.app.models.audit_log import AuditLog

class AuditRepository(BaseRepository[AuditLog]):
    pass


audit_repository = AuditRepository(AuditLog)
