export default function IntegrationCard({ integration, onConnect }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>{integration?.name || integration?.provider}</strong>
        <span>{integration?.is_active ? "Active" : "Inactive"}</span>
      </div>
      <button onClick={onConnect}>Connect</button>
    </div>
  );
}
