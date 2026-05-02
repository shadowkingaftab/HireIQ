import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function RecruiterDashboard() {
  const { currentUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSyncToGreenhouse = async (candidateId) => {
    try {
      const token = await currentUser.getIdToken();
      // Using a placeholder job ID for demonstration
      const placeholderJobId = "00000000-0000-0000-0000-000000000000"; 
      const response = await axios.post(
        `http://localhost:8000/ats/greenhouse/sync/${candidateId}/${placeholderJobId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert(`Candidate synced to Greenhouse! GH ID: ${response.data.greenhouse_candidate_id}`);
    } catch (err) {
      console.error("Error syncing to Greenhouse:", err);
      alert(err.response?.data?.detail || "Failed to sync candidate to Greenhouse");
    }
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          "http://localhost:8000/recruiter/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setData(response.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load recruiter dashboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [currentUser]);

  if (loading) return <LoadingSpinner />;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-[32px] shadow-xl border border-red-100 max-w-md text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900">Access Restricted</h2>
        <p className="text-gray-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.href = '/pricing'}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition"
        >
          View Plans
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recruiter Intelligence</h1>
            <p className="text-gray-500 font-medium">Manage your hiring pipeline with verifiable proof.</p>
          </div>
          <div className="text-right flex items-center space-x-4">
            <Link to="/recruiter/analytics" className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition shadow-sm">
              View Insights
            </Link>
            <Link to="/recruiter/preferences" className="bg-white border border-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-50 transition shadow-sm">
              Tune Engine
            </Link>
            <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-bold text-sm">Team Plan</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Candidates</p>
            <p className="text-3xl font-black text-gray-900">{data.candidates_count}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Feedback Given</p>
            <p className="text-3xl font-black text-gray-900">{data.total_feedback}</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Company</p>
            <p className="text-3xl font-black text-gray-900">{data.recruiter?.company_name || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Candidates</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                  <th className="pb-4 px-2">Name</th>
                  <th className="pb-4 px-2">GitHub</th>
                  <th className="pb-4 px-2">Joined</th>
                  <th className="pb-4 px-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.candidates.map((candidate) => (
                  <tr key={candidate.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-6 px-2">
                      <p className="font-bold text-gray-900">{candidate.name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{candidate.email}</p>
                    </td>
                    <td className="py-6 px-2">
                      <span className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-indigo-600 text-sm">
                        @{candidate.github || 'N/A'}
                      </span>
                    </td>
                    <td className="py-6 px-2 text-gray-500 font-medium">
                      {new Date(candidate.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-6 px-2 space-x-2">
                      <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm">
                        View Proof
                      </button>
                      <button 
                        onClick={() => handleSyncToGreenhouse(candidate.id)}
                        className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-emerald-100 transition shadow-sm"
                      >
                        Sync to Greenhouse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
