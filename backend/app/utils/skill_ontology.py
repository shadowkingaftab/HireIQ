import logging
from typing import Dict, List, Optional, Set

logger = logging.getLogger(__name__)


class SkillOntology:
    def __init__(self):
        self._skills: Set[str] = set()
        self._aliases: Dict[str, str] = {}
        self._categories: Dict[str, List[str]] = {}

    def register_skill(self, skill: str, category: Optional[str] = None, aliases: Optional[List[str]] = None) -> None:
        normalized = skill.lower().strip()
        self._skills.add(normalized)
        if aliases:
            for alias in aliases:
                self._aliases[alias.lower().strip()] = normalized
        if category:
            self._categories.setdefault(category.lower().strip(), []).append(normalized)

    def normalize(self, skill: str) -> str:
        return self._aliases.get(skill.lower().strip(), skill.lower().strip())

    def is_known(self, skill: str) -> bool:
        return self.normalize(skill) in self._skills

    def get_category(self, skill: str) -> Optional[str]:
        normalized = self.normalize(skill)
        for category, skills in self._categories.items():
            if normalized in skills:
                return category
        return None

    def list_skills(self) -> List[str]:
        return sorted(self._skills)


skill_ontology = SkillOntology()
