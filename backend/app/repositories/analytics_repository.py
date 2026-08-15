from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
from proofhire.backend.app.models.application import Application
from proofhire.backend.app.models.job import Job

class AnalyticsRepository:
    def get_org_stats(self, db: Session, *, organization_id: int) -> Dict[str, Any]:
        job_count = db.query(Job).filter(Job.organization_id == organization_id).count()
        app_count = db.query(Application).join(Job).filter(Job.organization_id == organization_id).count()
        
        return {
            "total_jobs": job_count,
            "total_applications": app_count,
        }

analytics_repository = AnalyticsRepository()
