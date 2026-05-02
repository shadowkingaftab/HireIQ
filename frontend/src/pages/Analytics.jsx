import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get(
          `http://localhost:8000/analytics/?days=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [currentUser, timeRange]);

  // Process data for charts
  const processTimelineData = () => {
    const timeline = events.reduce((acc, event) => {
      const date = new Date(event.timestamp).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(timeline)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const processEventTypeData = () => {
    const types = events.reduce((acc, event) => {
      acc[event.event_type] = (acc[event.event_type] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(types).map(([type, count]) => ({ type, count }));
  };

  const timelineData = processTimelineData();
  const eventTypeData = processEventTypeData();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Intelligence Analytics</h1>
            <p className="text-gray-500 font-medium">Network engagement and system performance</p>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(parseInt(e.target.value))}
            className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timeline Chart */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-2 h-6 bg-indigo-600 rounded-full mr-3"></span>
              System Engagement
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#9CA3AF', fontSize: 12}}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#4F46E5" 
                    strokeWidth={4} 
                    dot={{r: 6, fill: '#4F46E5', strokeWidth: 2, stroke: '#fff'}}
                    activeDot={{r: 8, strokeWidth: 0}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Distribution Chart */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8 flex items-center">
              <span className="w-2 h-6 bg-emerald-500 rounded-full mr-3"></span>
              Feature Utilization
            </h2>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventTypeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="type" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#4B5563', fontSize: 12, fontWeight: 600}}
                    width={120}
                  />
                  <Tooltip 
                    cursor={{fill: '#F9FAFB'}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Events</p>
            <p className="text-3xl font-black text-gray-900">{events.length}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Active Users</p>
            <p className="text-3xl font-black text-indigo-600">
              {new Set(events.map(e => e.user_id).filter(Boolean)).size}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Avg Events/Day</p>
            <p className="text-3xl font-black text-emerald-500">
              {Math.round(events.length / timeRange)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Growth</p>
            <p className="text-3xl font-black text-indigo-600">+12%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
