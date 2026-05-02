import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import SkillGraph from '../components/SkillGraph';
import AssessmentHistory from '../components/AssessmentHistory';
import ReferralLeaderboard from '../components/ReferralLeaderboard';

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:8000/candidates/profile/${currentUser.uid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-red-700">
        <p className="font-bold">{error}</p>
        <p className="text-sm mt-1">Make sure you are logged in and the backend is running.</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
      No profile found. Try uploading a resume first.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Your Profile</h1>
            <p className="text-gray-500 font-medium">Manage your skills and proof history</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Member Since</span>
            <p className="text-gray-900 font-bold">{new Date(profile.created_at).toLocaleDateString()}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mb-4">
              {profile.name ? profile.name[0] : profile.email[0].toUpperCase()}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Full Name</label>
              <p className="text-gray-900 font-bold text-lg">{profile.name || 'Not set'}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Email Address</label>
              <p className="text-gray-900 font-bold">{profile.email}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">GitHub Account</label>
              <p className="font-mono bg-gray-50 px-3 py-1 rounded-lg text-blue-600 inline-block">
                {profile.github_username ? `@${profile.github_username}` : 'Not connected'}
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {profile.skill_graph && (
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Skill Intelligence Graph</h2>
                <div className="h-[300px]">
                  <SkillGraph data={profile.skill_graph} />
                </div>
              </div>
            )}

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <AssessmentHistory candidateId={currentUser.uid} />
            </div>

            <ReferralLeaderboard />
          </div>
        </div>
      </div>
    </div>
  );
}
