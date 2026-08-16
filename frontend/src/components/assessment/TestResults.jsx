export default function TestResults({ results }) {
  return (
    <div>
      <h3>Results</h3>
      <p>Score: {results?.score ?? "—"}</p>
    </div>
  );
}
