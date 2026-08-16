export default function ProviderStatus({ status }) {
  const color = status === "ok" ? "#16a34a" : "#dc2626";
  return <span style={{ color, fontWeight: 600 }}>{status}</span>;
}
