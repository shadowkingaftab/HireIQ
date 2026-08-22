import { Link } from "react-router-dom";

export default function TopBar() {
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 24px", borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
      <Link to="/" style={{ fontWeight: 700 }}>ProofHire</Link>
      <nav style={{ display: "flex", gap: 16 }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/search/candidates">Search</Link>
        <Link to="/notifications">Notifications</Link>
      </nav>
    </header>
  );
}
