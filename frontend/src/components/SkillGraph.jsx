export default function SkillGraph({ data }) {
  return (
    <div className="graph-container">
      <h3>Skill Graph</h3>
      <p>Nodes: {data?.nodes?.length ?? 0}, Edges: {data?.edges?.length ?? 0}</p>
    </div>
  );
}
