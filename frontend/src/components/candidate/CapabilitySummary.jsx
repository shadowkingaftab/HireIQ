export default function CapabilitySummary({ candidate }) {
  return (
    <section>
      <h2>Capabilities</h2>
      <ul>
        {(candidate?.skills || []).map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
