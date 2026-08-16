export default function Button({ children, onClick, type = "button", disabled = false }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: "#2563eb", color: "#fff", cursor: disabled ? "not-allowed" : "pointer" }}>
      {children}
    </button>
  );
}
