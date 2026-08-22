import CandidateCard from "../recruiter/CandidateCard";

export default function CandidateMatches({ matches = [] }) {
  return (
    <div>
      <h3>Matches</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {matches.map((match) => <CandidateCard key={match.candidate_id} candidate={match.candidate} />)}
      </div>
    </div>
  );
}
