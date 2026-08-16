export default function ContributionHeatmap({ contributions }) {
  return (
    <section>
      <h2>Contribution Heatmap</h2>
      <p>{contributions?.length || 0} contributions.</p>
    </section>
  );
}
