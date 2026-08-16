import { useState } from "react";

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 80, zIndex: 1000 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 8, width: 480, maxHeight: 320, overflow: "hidden" }}>
        <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Type a command..." style={{ width: "100%", padding: 12, border: "none", borderBottom: "1px solid #e2e8f0" }} />
        <div style={{ padding: 12, color: "#64748b" }}>No results</div>
      </div>
    </div>
  );
}
