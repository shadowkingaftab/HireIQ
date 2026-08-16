import React, { useRef, useEffect } from "react";

export default function SkillGraphCanvas({ nodes = [], edges = [] }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const edge of edges) {
      const source = nodes.find((n) => n.id === edge.source);
      const target = nodes.find((n) => n.id === edge.target);
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = "#94a3b8";
        ctx.stroke();
      }
    }
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 24, 0, Math.PI * 2);
      ctx.fillStyle = "#2563eb";
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.fillText(node.label, node.x + 28, node.y + 4);
    }
  }, [nodes, edges]);
  return <canvas ref={canvasRef} width={800} height={500} style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8 }} />;
}
