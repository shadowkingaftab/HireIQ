from typing import Optional, List, Dict, Any
from datetime import datetime
from proofhire.backend.app.schemas import CoreModel, TimestampModel


class ReportBase(CoreModel):
    organization_id: int
    title: str
    type: str
    parameters: Optional[Dict[str, Any]] = None


class ReportCreate(ReportBase):
    pass


class Report(ReportBase, TimestampModel):
    id: int
    file_url: Optional[str] = None
    generated_at: Optional[datetime] = None
