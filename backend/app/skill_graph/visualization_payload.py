import logging
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class VisualizationPayload:
    def __init__(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
        self.nodes = nodes
        self.edges = edges

    def to_dict(self) -> Dict[str, Any]:
        return {"nodes": self.nodes, "edges": self.edges}

    def filter_by_type(self, node_type: str) -> "VisualizationPayload":
        filtered_nodes = [n for n in self.nodes if n.get("type") == node_type]
        node_ids = {n["id"] for n in filtered_nodes}
        filtered_edges = [e for e in self.edges if e["source"] in node_ids and e["target"] in node_ids]
        return VisualizationPayload(nodes=filtered_nodes, edges=filtered_edges)
