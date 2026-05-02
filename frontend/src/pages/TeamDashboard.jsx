import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamDashboard() {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [currentUser]);

  const fetchTeams = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();
      const response = await axios.get(
        "http://localhost:8000/teams/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setTeams(response.data);
    } catch (err) {
      setError('Failed to load teams');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    try {
      const token = await currentUser.getIdToken();
      await axios.post(
        `http://localhost:8000/teams?name=${newTeamName}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewTeamName('');
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to create team");
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!inviteCode) return;
    try {
      const token = await currentUser.getIdToken();
      const response = await axios.post(
        `http://localhost:8000/teams/join/${inviteCode}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert(`Joined team: ${response.data.team_name}`);
      setInviteCode('');
      fetchTeams();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to join team");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Team Intelligence</h1>
          <p className="text-gray-500 font-medium">Collaborate with your team to find the best talent.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Create Team */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Team Name</label>
                <input 
                  type="text" 
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. Engineering Squad"
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
              >
                Launch Team
              </button>
            </form>
          </div>

          {/* Join Team */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join Existing Team</h2>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Invite Code</label>
                <input 
                  type="text" 
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Paste code here..."
                  className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-medium"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition shadow-lg"
              >
                Join Team
              </button>
            </form>
          </div>
        </div>

        {/* My Teams */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">My Teams</h2>
          {teams.length === 0 ? (
            <p className="text-gray-500 font-medium italic">You haven't created or joined any teams yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => (
                <div key={team.id} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 hover:border-indigo-200 transition-colors">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 font-medium">Invite Code: <span className="font-mono text-indigo-600 font-bold">{team.invite_code}</span></p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs font-bold text-gray-400 uppercase">Owner</span>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">Manage</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
