export default function MatchScore({ score }) {
  return (
    <div style={{ fontSize: 32, fontWeight: 700, color: "#2563eb" }}>
      {Math.round((score ?? 0) * 100)}%
    </div>
  );
}
