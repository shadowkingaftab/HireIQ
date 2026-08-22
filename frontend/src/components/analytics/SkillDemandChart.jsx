export default function SkillDemandChart({ data = [] }) {
  return (
    <div>
      <h3>Skill Demand</h3>
      <ul>
        {data.map((item) => (
          <li key={item.name}>{item.name}: {item.count}</li>
        ))}
      </ul>
    </div>
  );
}
