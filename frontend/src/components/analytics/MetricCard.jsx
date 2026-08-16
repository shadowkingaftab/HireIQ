export default function MetricCard({ title, value, subtitle }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
      <div style={{ color: "#64748b", fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, color: "#64748b" }}>{subtitle}</div>}
    </div>
  );
}
