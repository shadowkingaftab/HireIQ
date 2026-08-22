import logging
from urllib.parse import urlparse
from typing import Optional

logger = logging.getLogger(__name__)


def is_same_domain(url_a: str, url_b: str) -> bool:
    try:
        return urlparse(url_a).netloc == urlparse(url_b).netloc
    except Exception:
        return False


def normalize_url(url: str) -> str:
    url = url.strip()
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    return url


def get_domain(url: str) -> Optional[str]:
    try:
        return urlparse(url).netloc
    except Exception:
        return None


def is_valid_github_url(url: str) -> bool:
    try:
        parsed = urlparse(url)
        return parsed.netloc in {"github.com", "www.github.com"}
    except Exception:
        return False
