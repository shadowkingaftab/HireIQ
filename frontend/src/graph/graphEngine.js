export function buildGraphPayload(nodes, edges) {
  return {
    nodes: nodes.map((n) => ({ id: n.id, label: n.label || n.name, type: n.type || n.group, properties: n.properties || {} })),
    edges: edges.map((e) => ({ source: e.source, target: e.target, type: e.type || "related", properties: e.properties || {} })),
  };
}
