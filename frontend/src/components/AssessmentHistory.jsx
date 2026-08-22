export default function AssessmentHistory({ history = [] }) {
  return (
    <div>
      <h3>Assessment History</h3>
      <ul>
        {history.map((item) => <li key={item.id}>{item.title}: {item.score}</li>)}
      </ul>
    </div>
  );
}
