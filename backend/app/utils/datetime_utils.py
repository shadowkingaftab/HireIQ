from datetime import datetime, timezone
from typing import Optional


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def to_iso(dt: Optional[datetime] = None) -> str:
    dt = dt or utc_now()
    return dt.isoformat()


def from_iso(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def days_between(start: str, end: str) -> int:
    s = from_iso(start)
    e = from_iso(end)
    return (e - s).days
