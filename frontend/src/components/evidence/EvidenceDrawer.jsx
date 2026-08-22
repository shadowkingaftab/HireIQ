import { createPortal } from "react-dom";

export default function EvidenceDrawer({ open, onClose, evidence }) {
  if (!open) return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ width: 360, background: "#fff", padding: 24, height: "100%", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <h3>Evidence</h3>
        <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(evidence, null, 2)}</pre>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
