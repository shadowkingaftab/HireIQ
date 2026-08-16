from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel


class AdminAction(CoreModel):
    actor_id: int
    action_type: str
    resource_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class SystemStats(CoreModel):
    user_count: int
    org_count: int
    job_count: int
    active_connections: int
