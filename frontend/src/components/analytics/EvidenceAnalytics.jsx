export default function EvidenceAnalytics({ evidence }) {
  return (
    <div>
      <h3>Evidence Analytics</h3>
      <p>Total evidence items: {evidence?.length ?? 0}</p>
    </div>
  );
}
