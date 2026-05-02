import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AssessmentHistory({ candidateId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!candidateId || !currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:8000/candidate-assessments/${candidateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setHistory(response.data);
      } catch (err) {
        console.error("Error fetching assessment history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [candidateId, currentUser]);

  if (loading) return (
    <div className="flex justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Assessment History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500 italic">No assessments completed yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">Skill</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.map((assessment) => (
                <tr key={assessment.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-gray-900">{assessment.skill}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      assessment.score >= 80 ? 'bg-green-100 text-green-700' : 
                      assessment.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {assessment.score}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-500 text-sm">
                    {new Date(assessment.completed_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
