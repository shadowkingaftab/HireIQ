export default function CandidateTable({ candidates = [], onSelect }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Name</th>
          <th style={{ textAlign: "left" }}>Skills</th>
          <th style={{ textAlign: "left" }}>Experience</th>
        </tr>
      </thead>
      <tbody>
        {candidates.map((candidate) => (
          <tr key={candidate.id} style={{ borderTop: "1px solid #e2e8f0", cursor: "pointer" }} onClick={() => onSelect?.(candidate)}>
            <td style={{ padding: 8 }}>{candidate.name}</td>
            <td style={{ padding: 8 }}>{(candidate.skills || []).slice(0, 4).join(", ")}</td>
            <td style={{ padding: 8 }}>{candidate.experience_years ?? 0} yrs</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
