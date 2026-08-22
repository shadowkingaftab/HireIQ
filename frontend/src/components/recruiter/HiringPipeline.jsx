export default function HiringPipeline({ stages = [] }) {
  return (
    <div style={{ display: "flex", gap: 16, overflowX: "auto" }}>
      {stages.map((stage) => (
        <div key={stage.id} style={{ minWidth: 220, border: "1px solid #e2e8f0", borderRadius: 8, padding: 12 }}>
          <h3>{stage.name}</h3>
          <p>{stage.count}</p>
          <ul>
            {(stage.items || []).map((item) => <li key={item.id}>{item.title}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}
