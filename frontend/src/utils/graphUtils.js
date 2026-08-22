export function buildGraphData(nodes = [], edges = []) {
  return {
    nodes: nodes.map((node) => ({ id: node.id, label: node.label || node.name, ...node })),
    edges: edges.map((edge) => ({ source: edge.source, target: edge.target, ...edge })),
  };
}

export function filterGraphData(graph, filters = {}) {
  return graph;
}
