from typing import Any, Dict, Optional
from sqlalchemy.orm import Session

class AnalyticsRepository:
    def summary(self, db: Session, *, organization_id: int) -> Dict[str, Any]:
        return {"total_applications": 0, "total_jobs": 0, "conversion_rate": 0.0, "time_to_hire_days": 0.0}


analytics_repository = AnalyticsRepository()
