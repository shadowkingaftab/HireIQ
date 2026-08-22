export default function CandidateHeader({ candidate }) {
  return (
    <header>
      <h1>{candidate?.name || "Candidate"}</h1>
      <p>{candidate?.summary || ""}</p>
    </header>
  );
}
