import { createPortal } from "react-dom";

export default function Drawer({ open, onClose, children }) {
  if (!open) return null;
  return createPortal(
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={onClose}>
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 320, background: "#fff", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}
