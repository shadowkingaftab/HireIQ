from typing import List, Dict, Any

class VisualizationPayloadBuilder:
    def build_d3_payload(self, nodes: List[str], edges: List[Dict[str, Any]]) -> Dict[str, Any]:
        return {
            "nodes": [{"id": n} for n in nodes],
            "links": [{"source": e["from"], "target": e["to"], "type": e["type"]} for e in edges]
        }

viz_builder = VisualizationPayloadBuilder()
