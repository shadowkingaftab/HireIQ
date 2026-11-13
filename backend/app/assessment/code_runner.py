import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class CodeRunner:
    async def run_code(self, *, code: str, language: str, tests: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "passed": False,
            "results": [{"error": "Code execution requires an isolated sandbox, which is not configured"}],
        }

code_runner = CodeRunner()
