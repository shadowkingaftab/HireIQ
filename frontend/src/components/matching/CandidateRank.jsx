export default function CandidateRank({ rank, candidateName }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontWeight: 700, width: 24 }}>#{rank}</span>
      <span>{candidateName}</span>
    </div>
  );
}
