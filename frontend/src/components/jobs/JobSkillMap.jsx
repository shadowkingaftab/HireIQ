export default function JobSkillMap({ skills = [] }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {skills.map((skill) => (
        <span key={skill} style={{ padding: "4px 10px", background: "#e0f2fe", color: "#0369a1", borderRadius: 999, fontSize: 12 }}>{skill}</span>
      ))}
    </div>
  );
}
