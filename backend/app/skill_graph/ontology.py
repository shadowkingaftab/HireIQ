from typing import Dict, List, Set, Any

class SkillOntology:
    def __init__(self):
        # Mapping of skill IDs to metadata
        self._skills: Dict[str, Dict[str, Any]] = {}
        # Hierarchy: category -> subcategory -> skill_ids
        self._hierarchy: Dict[str, Any] = {}

    def get_skill_metadata(self, skill_id: str) -> Dict[str, Any]:
        return self._skills.get(skill_id, {})

    def get_children(self, category: str) -> List[str]:
        return self._hierarchy.get(category, [])

ontology = SkillOntology()
