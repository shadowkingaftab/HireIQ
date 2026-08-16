export default function UsageMeter({ used, limit }) {
  const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Usage</span>
        <span>{used} / {limit}</span>
      </div>
      <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
        <div style={{ width: `${percent}%`, height: "100%", background: "#2563eb" }} />
      </div>
    </div>
  );
}
