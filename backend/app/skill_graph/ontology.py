import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Ontology:
    def __init__(self):
        self._nodes: Dict[str, Dict[str, Any]] = {}
        self._taxonomy: Dict[str, List[str]] = {}

    def register_node(self, node_id: str, properties: Dict[str, Any]) -> None:
        self._nodes[node_id] = properties

    def add_category(self, category: str, skills: List[str]) -> None:
        self._taxonomy[category] = skills

    def get_category(self, skill: str) -> Optional[str]:
        for category, skills in self._taxonomy.items():
            if skill in skills:
                return category
        return None

    def related(self, skill: str) -> List[str]:
        category = self.get_category(skill)
        if not category:
            return []
        return [s for s in self._taxonomy.get(category, []) if s != skill]


ontology = Ontology()
