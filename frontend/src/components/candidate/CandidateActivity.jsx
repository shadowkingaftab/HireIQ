export default function CandidateActivity({ activities }) {
  return (
    <section>
      <h2>Activity</h2>
      <ul>
        {(activities || []).map((activity) => (
          <li key={activity.id}>{activity.description}</li>
        ))}
      </ul>
    </section>
  );
}
