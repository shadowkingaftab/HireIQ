from backend.app.models.audit_log import AuditLog
from backend.app.repositories.base_repository import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    pass


audit_repository = AuditRepository(AuditLog)

