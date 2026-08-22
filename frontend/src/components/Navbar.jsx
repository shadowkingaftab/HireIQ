import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav>
      <Link to="/">ProofHire</Link>
      <div>
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
