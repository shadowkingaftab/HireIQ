import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black group-hover:rotate-12 transition-transform">P</div>
          <span className="text-xl font-black text-gray-900 tracking-tight">ProofHire</span>
        </Link>

        <div className="flex items-center space-x-8">
          {currentUser ? (
            <>
              <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Analyze</Link>
              <Link to="/profile" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Profile</Link>
              <Link to="/analytics" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Analytics</Link>
              <Link to="/pricing" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Pricing</Link>
              <Link to="/recruiter" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Recruiter</Link>
              <Link to="/teams" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Teams</Link>
              <button
                onClick={handleLogout}
                className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg shadow-gray-200"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Log In</Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
