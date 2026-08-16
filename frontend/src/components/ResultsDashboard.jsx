export default function ResultsDashboard({ results = [] }) {
  return (
    <div>
      <h3>Results</h3>
      <ul>
        {results.map((item) => <li key={item.id}>{item.name}: {item.score}</li>)}
      </ul>
    </div>
  );
}
