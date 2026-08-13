from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel

class ReportBase(CoreModel):
    organization_id: int
    title: str
    type: str
    parameters: Optional[Dict[str, Any]] = None

class Report(ReportBase):
    id: int
    file_url: Optional[str] = None
    generated_at: Optional[datetime] = None
