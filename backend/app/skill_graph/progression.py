import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Progression:
    def __init__(self):
        self._paths: Dict[str, List[str]] = {}

    def register_path(self, from_skill: str, to_skill: str) -> None:
        self._paths.setdefault(from_skill, []).append(to_skill)

    def next_steps(self, skill: str) -> List[str]:
        return self._paths.get(skill, [])

    def learning_path(self, start: str, target: str) -> List[str]:
        if start == target:
            return [start]
        visited = {start}
        queue = [[start]]
        while queue:
            path = queue.pop(0)
            node = path[-1]
            for next_skill in self._paths.get(node, []):
                if next_skill == target:
                    return path + [next_skill]
                if next_skill not in visited:
                    visited.add(next_skill)
                    queue.append(path + [next_skill])
        return []


progression = Progression()
