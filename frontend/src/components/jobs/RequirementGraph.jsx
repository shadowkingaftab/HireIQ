export default function RequirementGraph({ requirements = [] }) {
  return (
    <div>
      <h3>Requirements</h3>
      <ul>
        {requirements.map((req) => <li key={req.id}>{req.name}: {req.required ? "Required" : "Nice-to-have"}</li>)}
      </ul>
    </div>
  );
}
