from sqlalchemy.orm import Session
from backend.app.repositories.base_repository import BaseRepository
from backend.app.models.audit_log import AuditLog

class AuditRepository(BaseRepository[AuditLog]):
    pass


audit_repository = AuditRepository(AuditLog)

