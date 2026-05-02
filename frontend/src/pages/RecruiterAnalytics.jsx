import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function RecruiterAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [timeRange, setTimeRange] = useState(30);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:8000/recruiter/analytics?days=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [currentUser, timeRange]);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return <div className="p-8 text-center">Failed to load analytics.</div>;

  const activityData = [
    { name: 'Views', value: analytics.candidates_viewed },
    { name: 'Jobs', value: analytics.jobs_posted },
    { name: 'Matches', value: analytics.matches_analyzed }
  ];

  const skillsData = analytics.top_skills.map((skill, index) => ({
    name: skill.skill,
    value: skill.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Recruiter Insights</h1>
            <p className="text-gray-500 font-medium">Performance metrics and talent pool analytics.</p>
          </div>
          
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="p-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-700 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Avg Match Score</p>
            <p className="text-3xl font-black text-indigo-600">{analytics.avg_match_score}%</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Matches Analyzed</p>
            <p className="text-3xl font-black text-emerald-600">{analytics.matches_analyzed}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Candidates Viewed</p>
            <p className="text-3xl font-black text-amber-600">{analytics.candidates_viewed}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Jobs Posted</p>
            <p className="text-3xl font-black text-violet-600">{analytics.jobs_posted}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Activity Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Talent Skills</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
               {skillsData.map((skill) => (
                 <div key={skill.name} className="flex items-center space-x-2">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: skill.color}}></div>
                   <span className="text-sm font-bold text-gray-600">{skill.name} ({skill.value})</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
