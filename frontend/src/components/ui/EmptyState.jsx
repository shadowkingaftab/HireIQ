export default function EmptyState({ title, description }) {
  return (
    <div style={{ textAlign: "center", padding: 48, color: "#64748b" }}>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
    </div>
  );
}
