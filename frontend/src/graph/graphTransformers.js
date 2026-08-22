export function transformNodesToGraph(nodes) {
  return nodes.map((node) => ({ id: node.id, label: node.name || node.title || node.id, group: node.type }));
}

export function transformEdgesToGraph(edges) {
  return edges.map((edge) => ({ source: edge.source, target: edge.target, type: edge.type || "related" }));
}
