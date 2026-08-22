export function forceLayout(graph) {
  const { nodes, edges } = graph;
  const map = new Map(nodes.map((n) => [n.id, { ...n, x: Math.random() * 400, y: Math.random() * 400, vx: 0, vy: 0 }]));
  for (let i = 0; i < 50; i++) {
    for (const node of map.values()) {
      node.vx *= 0.9;
      node.vy *= 0.9;
      node.x += node.vx;
      node.y += node.vy;
    }
    for (const edge of edges) {
      const source = map.get(edge.source);
      const target = map.get(edge.target);
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - 80) / dist;
      source.vx += dx * force * 0.05;
      source.vy += dy * force * 0.05;
      target.vx -= dx * force * 0.05;
      target.vy -= dy * force * 0.05;
    }
  }
  return { nodes: Array.from(map.values()), edges };
}
