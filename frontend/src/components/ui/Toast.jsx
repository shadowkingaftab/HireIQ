import { useState, useEffect } from "react";

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const colors = { info: "#2563eb", success: "#16a34a", error: "#dc2626" };
  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, background: colors[type] || colors.info, color: "#fff", padding: "12px 16px", borderRadius: 6, zIndex: 1000 }}>
      {message}
    </div>
  );
}
