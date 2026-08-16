export default function CodeEditor({ value, onChange, language = "python" }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      language={language}
      style={{ width: "100%", minHeight: 200, fontFamily: "monospace", padding: 12, borderRadius: 6, border: "1px solid #e2e8f0" }}
    />
  );
}
