from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session

class RecruiterAnalytics:
    def summary(self, db: Session, *, recruiter_id: int) -> Dict[str, Any]:
        return {"recruiter_id": recruiter_id, "searches": 0, "views": 0, "shortlists": 0}


recruiter_analytics = RecruiterAnalytics()
