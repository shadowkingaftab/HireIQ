from datetime import datetime
from typing import Any, Dict, Optional

from backend.app.schemas import CoreModel, TimestampModel


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

