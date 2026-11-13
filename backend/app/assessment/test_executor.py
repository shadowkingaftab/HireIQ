import logging
from typing import Any, Dict

logger = logging.getLogger(__name__)


class TestExecutor:
    async def run(self, *, assessment_id: int, candidate_id: int) -> Dict[str, Any]:
        logger.debug("Running assessment %s for candidate %s", assessment_id, candidate_id)
        raise RuntimeError("Assessment grading is unavailable: no question source is configured")


test_executor = TestExecutor()

