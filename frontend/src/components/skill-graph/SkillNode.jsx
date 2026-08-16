export default function SkillNode({ node, selected, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: 8, border: selected ? "2px solid #2563eb" : "1px solid #e2e8f0", borderRadius: 8, background: "#fff" }}>
      <strong>{node.label}</strong>
      <p style={{ fontSize: 12, color: "#64748b" }}>{node.category}</p>
    </div>
  );
}
