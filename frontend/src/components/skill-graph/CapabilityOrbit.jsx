export default function CapabilityOrbit({ capabilities = [] }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {capabilities.map((cap) => (
        <span key={cap.name} style={{ padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 999, fontSize: 12 }}>
          {cap.name}
        </span>
      ))}
    </div>
  );
}
