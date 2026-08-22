import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class Centrality:
    def betweenness(self, graph: Dict[str, Any]) -> Dict[str, float]:
        nodes = [n.get("id") for n in graph.get("nodes", [])]
        scores = {node: 0.0 for node in nodes}
        for node in nodes:
            for other in nodes:
                if other == node:
                    continue
                path = self._shortest_path(graph, node, other)
                if path and len(path) > 2:
                    for mid in path[1:-1]:
                        scores[mid] = scores.get(mid, 0.0) + 1
        total = max(sum(scores.values()), 1)
        return {k: v / total for k, v in scores.items()}

    def _shortest_path(self, graph: Dict[str, Any], source: str, target: str) -> List[str]:
        from collections import deque
        adj: Dict[str, List[str]] = {n.get("id", ""): [] for n in graph.get("nodes", [])}
        for edge in graph.get("edges", []):
            adj.setdefault(edge.get("source", ""), []).append(edge.get("target", ""))
        visited = {source}
        queue = deque([[source]])
        while queue:
            path = queue.popleft()
            node = path[-1]
            if node == target:
                return path
            for neighbor in adj.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(path + [neighbor])
        return []


centrality = Centrality()
