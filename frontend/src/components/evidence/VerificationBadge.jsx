export default function VerificationBadge({ verified }) {
  return <span style={{ color: verified ? "#16a34a" : "#f59e0b", fontWeight: 600 }}>{verified ? "Verified" : "Unverified"}</span>;
}
