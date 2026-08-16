export default function Progress({ value = 0, max = 100 }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div role="progressbar" aria-valuenow={percent} style={{ width: "100%", height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
      <div style={{ width: `${percent}%`, height: "100%", background: "#2563eb" }} />
    </div>
  );
}
