export default function GraphLegend({ items = [] }) {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      {items.map((item) => (
        <span key={item.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
