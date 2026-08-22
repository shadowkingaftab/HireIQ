export default function Skeleton({ width = "100%", height = 16 }) {
  return <div style={{ width, height, background: "#e2e8f0", borderRadius: 4, animation: "pulse 1.5s infinite" }} />;
}
