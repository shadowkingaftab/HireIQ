export default function EvidenceCard({ evidence }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{evidence?.title || evidence?.type || "Evidence"}</strong>
        <span style={{ fontSize: 12, color: "#64748b" }}>{evidence?.source || ""}</span>
      </div>
      <p style={{ fontSize: 14, color: "#334155" }}>{evidence?.description}</p>
    </div>
  );
}
