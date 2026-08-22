export default function GapAnalysis({ missingSkills }) {
  return (
    <div>
      <h3>Gap Analysis</h3>
      <ul>
        {(missingSkills || []).map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}
