export default function TeamManager({ teams = [] }) {
  return (
    <div>
      <h3>Teams</h3>
      <ul>
        {teams.map((team) => <li key={team.id}>{team.name}: {team.member_count || 0} members</li>)}
      </ul>
    </div>
  );
}
