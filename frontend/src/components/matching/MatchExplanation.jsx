export default function MatchExplanation({ reasoning }) {
  return (
    <div>
      <h3>Explanation</h3>
      <p>{reasoning?.summary || reasoning?.text || "No explanation available."}</p>
    </div>
  );
}
