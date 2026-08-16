export default function SkillEdge({ edge }) {
  return (
    <div style={{ padding: 4, fontSize: 12, color: "#64748b" }}>
      {edge.source} → {edge.target} ({edge.type})
    </div>
  );
}
