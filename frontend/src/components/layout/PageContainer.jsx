export default function PageContainer({ children, maxWidth = 1200 }) {
  return <div style={{ maxWidth, margin: "0 auto", padding: 24 }}>{children}</div>;
}
