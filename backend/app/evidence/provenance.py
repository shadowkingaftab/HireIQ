import logging
from typing import Any, Dict, Optional

logger = logging.getLogger(__name__)


class Provenance:
    def record_origin(self, *, evidence_id: int, origin_details: Dict[str, Any]) -> None:
        logger.debug("Recorded provenance for evidence %s", evidence_id)


provenance = Provenance()
