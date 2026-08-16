export function onNodeClick(node, onClick) {
  return (event, graphNode) => {
    if (!graphNode || !node.id) return;
    onClick?.(node);
  };
}

export function onNodeHover(node, onHover) {
  return (event, graphNode) => {
    if (!graphNode) return;
    onHover?.(node, graphNode);
  };
}
