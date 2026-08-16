export default function ProvenanceTrail({ trail = [] }) {
  return (
    <ol style={{ paddingLeft: 16 }}>
      {trail.map((item, index) => <li key={index}>{item.source}: {item.timestamp}</li>)}
    </ol>
  );
}
