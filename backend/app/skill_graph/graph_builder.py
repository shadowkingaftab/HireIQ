import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class SkillGraph:
    def __init__(self):
        self._nodes: Dict[str, Dict[str, Any]] = {}
        self._edges: List[Dict[str, Any]] = []

    def add_node(self, node_id: str, properties: Optional[Dict[str, Any]] = None) -> None:
        self._nodes[node_id] = properties or {}

    def add_edge(self, source: str, target: str, edge_type: str = "related", properties: Optional[Dict[str, Any]] = None) -> None:
        self._edges.append({"source": source, "target": target, "type": edge_type, "properties": properties or {}})

    def get_node(self, node_id: str) -> Dict[str, Any]:
        return self._nodes.get(node_id, {})

    def neighbors(self, node_id: str) -> List[Dict[str, Any]]:
        neighbors = []
        for edge in self._edges:
            if edge["source"] == node_id:
                neighbors.append(self._nodes.get(edge["target"], {}))
            elif edge["target"] == node_id:
                neighbors.append(self._nodes.get(edge["source"], {}))
        return neighbors

    def shortest_path(self, source: str, target: str) -> List[str]:
        from collections import deque
        visited = {source}
        queue = deque([[source]])
        while queue:
            path = queue.popleft()
            node = path[-1]
            if node == target:
                return path
            for edge in self._edges:
                neighbor = None
                if edge["source"] == node and edge["target"] not in visited:
                    neighbor = edge["target"]
                elif edge["target"] == node and edge["source"] not in visited:
                    neighbor = edge["source"]
                if neighbor:
                    visited.add(neighbor)
                    queue.append(path + [neighbor])
        return []
