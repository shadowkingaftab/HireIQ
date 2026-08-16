export default function Tooltip({ text, children }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {children}
      <span role="tooltip" style={{ position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)", background: "#0f172a", color: "#fff", padding: "4px 8px", borderRadius: 4, fontSize: 12, whiteSpace: "nowrap" }}>
        {text}
      </span>
    </span>
  );
}
