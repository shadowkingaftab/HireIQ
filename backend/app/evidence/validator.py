import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class Validator:
    def validate(self, *, evidence_data: Dict[str, Any]) -> bool:
        if not evidence_data:
            return False
        if not evidence_data.get("source"):
            return False
        return True


validator = Validator()
