import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class Specialization:
    def __init__(self):
        self._specializations: Dict[str, Dict[str, Any]] = {}

    def register(self, skill: str, metadata: Dict[str, Any]) -> None:
        self._specializations[skill] = metadata

    def get(self, skill: str) -> Dict[str, Any]:
        return self._specializations.get(skill, {})

    def list_specializations(self) -> List[str]:
        return list(self._specializations.keys())


specialization = Specialization()
