export default function CandidateCard({ candidate, onClick }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16, cursor: "pointer" }} onClick={onClick}>
      <h3>{candidate?.name || "Candidate"}</h3>
      <p>{candidate?.summary}</p>
      <div>{candidate?.skills?.slice(0, 4).join(", ")}</div>
    </div>
  );
}
