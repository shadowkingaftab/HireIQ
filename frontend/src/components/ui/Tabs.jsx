export default function Tabs({ items, activeKey, onChange }) {
  return (
    <div>
      <div role="tablist" style={{ display: "flex", gap: 8, borderBottom: "1px solid #e2e8f0" }}>
        {items.map((item) => (
          <button key={item.key} role="tab" aria-selected={activeKey === item.key} onClick={() => onChange?.(item.key)} style={{ padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer" }}>
            {item.label}
          </button>
        ))}
      </div>
      <div style={{ padding: 16 }}>{items.find((i) => i.key === activeKey)?.children}</div>
    </div>
  );
}
