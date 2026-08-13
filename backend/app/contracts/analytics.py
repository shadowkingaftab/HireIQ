from typing import Optional, List, Dict, Any
from proofhire.backend.app.schemas import CoreModel

class AnalyticsBase(CoreModel):
    organization_id: int
    metric_name: str
    value: float
    dimensions: Optional[Dict[str, str]] = None

class AnalyticsSummary(CoreModel):
    total_applications: int
    total_jobs: int
    conversion_rate: float
    time_to_hire_days: float
