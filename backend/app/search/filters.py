import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class SearchFilters:
    def __init__(
        self,
        organization_id: Optional[str] = None,
        skills: Optional[List[str]] = None,
        location: Optional[str] = None,
        min_experience_years: Optional[int] = None,
        level: Optional[str] = None,
        available: Optional[bool] = None,
        status: Optional[str] = None,
        min_confidence: Optional[float] = None,
        **kwargs: Any,
    ):
        self.organization_id = organization_id
        self.skills = [s.lower() for s in skills] if skills else []
        self.location = location.lower() if location else None
        self.min_experience_years = min_experience_years
        self.level = level.lower() if level else None
        self.available = available
        self.status = status.lower() if status else None
        self.min_confidence = min_confidence
        self.extra = kwargs

    def to_dict(self) -> Dict[str, Any]:
        payload: Dict[str, Any] = {}
        if self.organization_id:
            payload["organization_id"] = self.organization_id
        if self.skills:
            payload["skills"] = self.skills
        if self.location:
            payload["location"] = self.location
        if self.min_experience_years is not None:
            payload["min_experience_years"] = self.min_experience_years
        if self.level:
            payload["level"] = self.level
        if self.available is not None:
            payload["available"] = self.available
        if self.status:
            payload["status"] = self.status
        if self.min_confidence is not None:
            payload["min_confidence"] = self.min_confidence
        for key, value in self.extra.items():
            if value is not None:
                payload[key] = value
        return payload

    def apply(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        filtered = []
        for item in results:
            if self.organization_id and item.get("organization_id") != self.organization_id:
                continue
            if self.skills:
                item_skills = {s.lower() for s in item.get("skills", [])}
                if not item_skills.intersection(set(self.skills)):
                    continue
            if self.location and self.location not in (item.get("location", "") or "").lower():
                continue
            if self.min_experience_years is not None:
                if (item.get("experience_years") or 0) < self.min_experience_years:
                    continue
            if self.level and item.get("level") != self.level:
                continue
            if self.available is not None and item.get("available") != self.available:
                continue
            if self.status and item.get("status") != self.status:
                continue
            if self.min_confidence is not None and (item.get("confidence") or 0.0) < self.min_confidence:
                continue
            filtered.append(item)
        return filtered


def build_filter_predicate(filters: Dict[str, Any]) -> Optional[str]:
    if not filters:
        return None
    parts = []
    if "skills" in filters:
        parts.append("skills && %(skills)s")
    if "location" in filters:
        parts.append("location ILIKE %(location)s")
    if "min_experience_years" in filters:
        parts.append("experience_years >= %(min_experience_years)s")
    if "level" in filters:
        parts.append("level = %(level)s")
    if "available" in filters:
        parts.append("available = %(available)s")
    if "status" in filters:
        parts.append("status = %(status)s")
    if "min_confidence" in filters:
        parts.append("confidence >= %(min_confidence)s")
    return " AND ".join(parts) if parts else None
