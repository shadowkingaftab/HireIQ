import logging
import re
from typing import Optional

logger = logging.getLogger(__name__)


def slugify(value: str) -> str:
    value = value.lower().strip()
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-")


def generate_slug(value: str) -> str:
    return slugify(value)


def is_valid_slug(value: str) -> bool:
    pattern = r"^[a-z0-9]+(?:-[a-z0-9]+)*$"
    return bool(re.match(pattern, value))
