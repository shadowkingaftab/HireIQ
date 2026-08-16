export default function Sidebar({ items = [] }) {
  return (
    <aside style={{ width: 240, borderRight: "1px solid #e2e8f0", padding: 16 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
      </nav>
    </aside>
  );
}
