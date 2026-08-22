import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)


def is_valid_email(value: str) -> bool:
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, value))


def is_valid_url(value: str) -> bool:
    pattern = r"^https?://[^\s]+$"
    return bool(re.match(pattern, value))


def is_valid_slug(value: str) -> bool:
    pattern = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"
    return bool(re.match(pattern, value))


def validate_required(value: Optional[str], field_name: str) -> None:
    if value is None or value.strip() == "":
        raise ValueError(f"{field_name} is required")


def validate_max_length(value: str, field_name: str, max_length: int) -> None:
    if len(value) > max_length:
        raise ValueError(f"{field_name} must be at most {max_length} characters")
