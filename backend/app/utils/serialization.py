import json
import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


def to_json(data: Any) -> str:
    return json.dumps(data, default=str)


def from_json(raw: str) -> Any:
    return json.loads(raw)


def safe_json_loads(raw: Optional[str], default: Any = None) -> Any:
    if not raw:
        return default
    try:
        return from_json(raw)
    except (json.JSONDecodeError, TypeError):
        logger.debug("Failed to parse JSON: %s", raw[:100])
        return default
