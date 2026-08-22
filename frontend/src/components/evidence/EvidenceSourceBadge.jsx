export default function EvidenceSourceBadge({ source }) {
  const colors = { github: "#24292e", linkedin: "#0a66c2", resume: "#2563eb", assessment: "#16a34a" };
  return <span style={{ background: colors[source] || "#64748b", color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>{source}</span>;
}
