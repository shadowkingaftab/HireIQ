import { NavLink } from "react-router-dom";

export default function RecruiterSidebar() {
  return (
    <aside style={{ width: 240, borderRight: "1px solid #e2e8f0", padding: 16 }}>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink to="/recruiter">Dashboard</NavLink>
        <NavLink to="/search/candidates">Candidates</NavLink>
        <NavLink to="/jobs">Jobs</NavLink>
        <NavLink to="/applications">Applications</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </nav>
    </aside>
  );
}
