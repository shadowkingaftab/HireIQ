import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class GraphQuery:
    def __init__(self, graph: Any):
        self.graph = graph

    def query(self, skill_names: List[str], depth: int = 1) -> Dict[str, Any]:
        nodes: List[Dict[str, Any]] = []
        edges: List[Dict[str, Any]] = []
        visited = set()
        queue = [(name, 0) for name in skill_names]
        while queue:
            current, current_depth = queue.pop(0)
            if current in visited or current_depth > depth:
                continue
            visited.add(current)
            node = self.graph.get_node(current)
            if node:
                nodes.append({"id": current, **node})
            for neighbor in self.graph.neighbors(current):
                neighbor_id = neighbor.get("id")
                if neighbor_id and neighbor_id not in visited:
                    edges.append({"source": current, "target": neighbor_id, "type": "related"})
                    queue.append((neighbor_id, current_depth + 1))
        return {"nodes": nodes, "edges": edges}


graph_query = GraphQuery(graph=None)
