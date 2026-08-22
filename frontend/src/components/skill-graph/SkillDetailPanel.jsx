export default function SkillDetailPanel({ skill }) {
  if (!skill) return null;
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 16 }}>
      <h3>{skill.label}</h3>
      <p>{skill.description}</p>
      <div>Category: {skill.category}</div>
    </div>
  );
}
