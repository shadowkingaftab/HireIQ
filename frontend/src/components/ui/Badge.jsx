export default function Badge({ children, color = "blue" }) {
  const colors = { blue: "#2563eb", green: "#16a34a", red: "#dc2626", gray: "#64748b" };
  return (
    <span style={{ background: colors[color] || colors.blue, color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 12 }}>
      {children}
    </span>
  );
}
