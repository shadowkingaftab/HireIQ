export default function Dropdown({ trigger, items, onSelect }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {trigger}
      <ul style={{ position: "absolute", right: 0, top: "100%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6, minWidth: 160, listStyle: "none", padding: 4, margin: 0 }}>
        {items.map((item) => (
          <li key={item.key} style={{ padding: "8px 12px", cursor: "pointer" }} onClick={() => onSelect?.(item.key)}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
