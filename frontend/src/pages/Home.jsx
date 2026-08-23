import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container">
      <h1>ProofHire</h1>
      <p>Evidence-first hiring intelligence platform.</p>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to="/login" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Login
        </Link>
        <Link to="/signup" style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Sign Up
        </Link>
        <Link to="/dashboard" style={{ padding: '0.5rem 1rem', backgroundColor: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Dashboard
        </Link>
      </div>
    </div>
  );
}
