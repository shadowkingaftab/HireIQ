import logging
from typing import Dict, List, Set, Tuple

logger = logging.getLogger(__name__)


class SkillAdjacency:
    def __init__(self):
        self._graph: Dict[str, Set[str]] = {}

    def add_edge(self, source: str, target: str) -> None:
        s = source.lower().strip()
        t = target.lower().strip()
        self._graph.setdefault(s, set()).add(t)
        self._graph.setdefault(t, set()).add(s)

    def neighbors(self, skill: str) -> Set[str]:
        return self._graph.get(skill.lower().strip(), set())

    def related_skills(self, skill: str, depth: int = 1) -> Set[str]:
        current = {skill.lower().strip()}
        visited = set(current)
        for _ in range(depth):
            next_level = set()
            for s in current:
                for neighbor in self._graph.get(s, set()):
                    if neighbor not in visited:
                        next_level.add(neighbor)
                        visited.add(neighbor)
            current = next_level
        return visited - {skill.lower().strip()}

    def shortest_path(self, source: str, target: str) -> List[str]:
        source = source.lower().strip()
        target = target.lower().strip()
        if source == target:
            return [source]
        visited = {source}
        queue = [(source, [source])]
        while queue:
            current, path = queue.pop(0)
            for neighbor in self._graph.get(current, set()):
                if neighbor == target:
                    return path + [neighbor]
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        return []

    def build_from_edges(self, edges: List[Tuple[str, str]]) -> None:
        for source, target in edges:
            self.add_edge(source, target)


skill_adjacency = SkillAdjacency()
