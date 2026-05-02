import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const COMMON_SKILLS = ["Python", "JavaScript", "React", "Node.js", "Django", "AWS", "PostgreSQL", "Docker", "Kubernetes", "TypeScript"];

export default function RecruiterPreferences() {
  const [preferences, setPreferences] = useState({
    skill_weights: {},
    role_weights: {},
    experience_weights: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          "http://localhost:8000/recruiter/preferences",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setPreferences(response.data);
      } catch (err) {
        console.error("Error fetching preferences:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, [currentUser]);

  const handleUpdate = async () => {
    try {
      setSaving(true);
      const token = await currentUser.getIdToken();
      await axios.post(
        "http://localhost:8000/recruiter/preferences",
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Intelligence weights updated successfully!");
    } catch (err) {
      console.error("Error updating preferences:", err);
      alert("Failed to update preferences");
    } finally {
      setSaving(false);
    }
  };

  const handleWeightChange = (category, key, value) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: parseFloat(value)
      }
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Intelligence Tuning</h1>
          <p className="text-gray-500 font-medium">Customize the neural matching engine weights to prioritize specific capabilities.</p>
        </header>

        <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Skill Prioritization</h2>
              <p className="text-sm text-gray-500 font-medium mt-1">Adjust importance: 1.0 is neutral, >1.0 is higher priority, <1.0 is lower.</p>
            </div>
            <button 
              onClick={handleUpdate}
              disabled={saving}
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 disabled:bg-gray-300"
            >
              {saving ? 'Syncing...' : 'Save Config'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COMMON_SKILLS.map((skill) => (
              <div key={skill} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">{skill}</span>
                <div className="flex items-center space-x-3">
                  <input 
                    type="range" 
                    min="0.1" 
                    max="2.0" 
                    step="0.1"
                    value={preferences.skill_weights[skill] || 1.0}
                    onChange={(e) => handleWeightChange('skill_weights', skill, e.target.value)}
                    className="w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                  <span className="w-10 text-right font-mono text-xs font-bold text-indigo-600">
                    {(preferences.skill_weights[skill] || 1.0).toFixed(1)}x
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Seniority Bias</h2>
            <div className="space-y-4">
              {["Junior", "Senior", "Lead", "Architect"].map((role) => (
                <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">{role}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={preferences.role_weights[role] || 1.0}
                    onChange={(e) => handleWeightChange('role_weights', role, e.target.value)}
                    className="w-20 p-2 bg-white border border-gray-200 rounded-lg text-right font-mono text-xs font-bold text-indigo-600"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Experience weighting</h2>
            <div className="space-y-4">
              {["1-3 years", "3-5 years", "5+ years", "10+ years"].map((exp) => (
                <div key={exp} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm font-bold text-gray-600">{exp}</span>
                  <input 
                    type="number" 
                    step="0.1"
                    value={preferences.experience_weights[exp] || 1.0}
                    onChange={(e) => handleWeightChange('experience_weights', exp, e.target.value)}
                    className="w-20 p-2 bg-white border border-gray-200 rounded-lg text-right font-mono text-xs font-bold text-indigo-600"
                  />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
