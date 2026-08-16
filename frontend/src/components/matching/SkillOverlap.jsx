export default function SkillOverlap({ candidateSkills = [], jobSkills = [] }) {
  const overlap = candidateSkills.filter((s) => jobSkills.includes(s));
  return (
    <div>
      <h3>Skill Overlap</h3>
      <p>{overlap.length} of {jobSkills.length} required skills matched.</p>
      <ul>
        {overlap.map((skill) => <li key={skill}>{skill}</li>)}
      </ul>
    </div>
  );
}
