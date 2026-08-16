export default function HiringFunnel({ stages = [] }) {
  return (
    <div>
      <h3>Hiring Funnel</h3>
      <ol>
        {stages.map((stage) => (
          <li key={stage.name}>{stage.name}: {stage.count}</li>
        ))}
      </ol>
    </div>
  );
}
