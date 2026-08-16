import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


class EvidenceGraph:
    def __init__(self):
        self._nodes: Dict[str, Dict[str, Any]] = {}
        self._edges: List[Dict[str, Any]] = []

    def add_node(self, node_id: str, properties: Optional[Dict[str, Any]] = None) -> None:
        self._nodes[node_id] = properties or {}

    def add_edge(self, source: str, target: str, edge_type: str, properties: Optional[Dict[str, Any]] = None) -> None:
        self._edges.append({"source": source, "target": target, "type": edge_type, "properties": properties or {}})

    def traverse(self, start_node_id: str, relation_types: Optional[List[str]] = None, max_hops: int = 2) -> List[Dict[str, Any]]:
        visited = {start_node_id}
        current = [start_node_id]
        results = []
        for _ in range(max_hops):
            next_nodes = []
            for node_id in current:
                for edge in self._edges:
                    if edge["source"] == node_id and (relation_types is None or edge["type"] in relation_types):
                        target = edge["target"]
                        if target not in visited:
                            visited.add(target)
                            next_nodes.append(target)
                            results.append({"node_id": target, "edge": edge})
            current = next_nodes
        return results

    def clear(self) -> None:
        self._nodes.clear()
        self._edges.clear()


evidence_graph = EvidenceGraph()
