export default function MatchBreakdown({ breakdown }) {
  const items = breakdown || {};
  return (
    <div>
      <h3>Match Breakdown</h3>
      <ul>
        {Object.entries(items).map(([key, value]) => (
          <li key={key}>{key}: {typeof value === "number" ? `${(value * 100).toFixed(1)}%` : JSON.stringify(value)}</li>
        ))}
      </ul>
    </div>
  );
}
