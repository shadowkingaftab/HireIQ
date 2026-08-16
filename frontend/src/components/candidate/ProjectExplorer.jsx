export default function ProjectExplorer({ projects }) {
  return (
    <section>
      <h2>Projects</h2>
      <ul>
        {(projects || []).map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </section>
  );
}
