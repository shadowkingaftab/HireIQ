import logging
import re
from typing import List, Optional

logger = logging.getLogger(__name__)


def truncate(text: str, length: int = 200, suffix: str = "...") -> str:
    if len(text) <= length:
        return text
    return text[:length - len(suffix)] + suffix


def clean_whitespace(text: str) -> str:
    return " ".join(text.split())


def extract_emails(text: str) -> List[str]:
    return re.findall(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", text)


def extract_urls(text: str) -> List[str]:
    return re.findall(r"https?://[^\s]+", text)


def remove_html_tags(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text)


def is_empty(value: Optional[str]) -> bool:
    return value is None or value.strip() == ""
