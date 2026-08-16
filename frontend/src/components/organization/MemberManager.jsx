export default function MemberManager({ members = [] }) {
  return (
    <div>
      <h3>Members</h3>
      <ul>
        {members.map((member) => <li key={member.id}>{member.name} ({member.role})</li>)}
      </ul>
    </div>
  );
}
