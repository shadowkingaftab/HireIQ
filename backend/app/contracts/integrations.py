from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel

class IntegrationBase(CoreModel):
    name: str
    provider: str
    config: Optional[Dict[str, Any]] = None
    is_active: bool = True

class Integration(IntegrationBase):
    id: int
    organization_id: int
