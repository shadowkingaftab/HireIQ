import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get("http://localhost:8000/referrals/leaderboard");
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        Proof Network Referrers
      </h2>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry) => (
            <div key={entry.rank} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:border-amber-200 transition-all">
              <div className="flex items-center space-x-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-sm ${
                  entry.rank === 1 ? 'bg-amber-100 text-amber-600' : 
                  entry.rank === 2 ? 'bg-slate-100 text-slate-600' :
                  entry.rank === 3 ? 'bg-orange-100 text-orange-600' :
                  'bg-white text-gray-400'
                }`}>
                  {entry.rank}
                </span>
                <div>
                  <p className="font-bold text-gray-900">{entry.name}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {entry.rewards.map((reward, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-tighter bg-amber-500 text-white px-2 py-0.5 rounded-full">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-gray-900">{entry.referrals}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referrals</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
