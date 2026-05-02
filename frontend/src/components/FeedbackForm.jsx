import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function FeedbackForm({ candidateId, jobId, onSubmit }) {
  const [hired, setHired] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(3);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Get the token from current user
      // Note: In production, ensure the token is handled correctly
      const token = localStorage.getItem('token'); 
      
      const response = await axios.post(
        "http://localhost:8000/feedback/",
        {
          candidate_id: candidateId,
          job_id: jobId,
          hired,
          performance_score: hired ? performanceScore : null,
          notes
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (onSubmit) onSubmit(response.data);
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        Hiring Feedback
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="hired"
            checked={hired}
            onChange={(e) => setHired(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="hired" className="ml-3 text-lg font-medium text-gray-700">
            Candidate was hired
          </label>
        </div>

        {hired && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-sm font-bold text-gray-400 uppercase mb-4">
              Performance Score (1-5)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="5"
                step="0.5"
                value={performanceScore}
                onChange={(e) => setPerformanceScore(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <span className="text-2xl font-black text-blue-600 w-12 text-center">{performanceScore}</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-4 border border-gray-200 rounded-2xl h-32 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Share your thoughts on the candidate's performance or fit..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.01] active:scale-95 ${
            loading ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600 shadow-yellow-100"
          }`}
        >
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
}
