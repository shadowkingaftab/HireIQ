export default function EvidenceTimeline({ evidence }) {
  return (
    <section>
      <h2>Evidence Timeline</h2>
      <ul>
        {(evidence || []).map((item) => (
          <li key={item.id}>{item.type}: {item.description}</li>
        ))}
      </ul>
    </section>
  );
}
