export default function EvidenceFit({ evidenceScore, confidence }) {
  return (
    <div>
      <h3>Evidence Fit</h3>
      <p>Score: {(evidenceScore ?? 0).toFixed(2)}</p>
      <p>Confidence: {(confidence ?? 0).toFixed(2)}</p>
    </div>
  );
}
