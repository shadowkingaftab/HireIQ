from proofhire.backend.app.dependencies.auth import get_current_active_user
from proofhire.backend.app.dependencies.permissions import require_roles

__all__ = ["get_current_active_user", "require_roles"]
