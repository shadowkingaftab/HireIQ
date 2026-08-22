export function applyFilters(graph, filters = {}) {
  if (!filters.types || filters.types.length === 0) return graph;
  const filteredNodes = graph.nodes.filter((node) => filters.types.includes(node.type || node.group));
  const ids = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = graph.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target));
  return { nodes: filteredNodes, edges: filteredEdges };
}
