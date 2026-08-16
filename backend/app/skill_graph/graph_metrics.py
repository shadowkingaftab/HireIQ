import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class GraphMetrics:
    def degree_centrality(self, graph: Dict[str, Any]) -> Dict[str, float]:
        nodes = graph.get("nodes", [])
        edges = graph.get("edges", [])
        degree_map = {node.get("id", ""): 0 for node in nodes}
        for edge in edges:
            source = edge.get("source")
            target = edge.get("target")
            degree_map[source] = degree_map.get(source, 0) + 1
            degree_map[target] = degree_map.get(target, 0) + 1
        total = max(len(edges) * 2, 1)
        return {node: count / total for node, count in degree_map.items()}

    def shortest_path_length(self, graph: Dict[str, Any], source: str, target: str) -> int:
        from collections import deque
        adj: Dict[str, List[str]] = {}
        for node in graph.get("nodes", []):
            adj[node.get("id", "")] = []
        for edge in graph.get("edges", []):
            adj.setdefault(edge.get("source", ""), []).append(edge.get("target", ""))
        visited = {source}
        queue = deque([(source, 0)])
        while queue:
            node, dist = queue.popleft()
            if node == target:
                return dist
            for neighbor in adj.get(node, []):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, dist + 1))
        return -1


graph_metrics = GraphMetrics()
