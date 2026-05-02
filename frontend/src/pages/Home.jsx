import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCandidates } from "../services/api";
import OnboardingTour from "../components/OnboardingTour";
import MetaTags from "../components/MetaTags";

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [runTour, setRunTour] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const data = await getCandidates();
        setCandidates(data.slice(0, 3)); // Just show top 3 on home
        setLoading(false);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <MetaTags 
        title="Hire Based on Proof, Not Resumes" 
        description="The Intelligence Network that replaces traditional resumes with verifiable skill profiles. Hire based on actual engineering ability." 
      />
      <OnboardingTour run={runTour} setRun={setRunTour} />
      {/* Hero Section */}
      <div className="bg-gradient text-white py-24 px-6 hero-section">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tighter">
            Hire Based on <span className="text-indigo-200">Proof</span>, Not Resumes
          </h1>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium text-indigo-50 opacity-90">
            The Intelligence Network that replaces traditional resumes with verifiable skill profiles, 
            matching candidates to jobs based on actual engineering ability.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link to="/signup" className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:bg-indigo-50 transition transform hover:scale-105 active:scale-95">
              Launch Your Profile
            </Link>
            <button 
              onClick={() => setRunTour(true)}
              className="bg-indigo-900/30 backdrop-blur-md border-2 border-white/30 px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/10 transition"
            >
              Take a Tour
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-gray-900 mb-4">The Proof-of-Skill Framework</h2>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Beyond the keyword search</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🎯",
                title: "Semantic Intelligence",
                description: "Our neural matching engine understands the context of your skills, not just the labels."
              },
              {
                icon: "🔍",
                title: "Verifiable Evidence",
                description: "Direct GitHub integration and micro-assessments turn claims into undeniable proof."
              },
              {
                icon: "📈",
                title: "Dynamic Evolution",
                description: "Your skill graph grows with you, reflecting real-world performance and trainability."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mb-8">{feature.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Proofs Section */}
      <div className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900">Recent Proofs</h2>
              <p className="text-gray-500 font-medium mt-2">Latest candidates verified by the network</p>
            </div>
            <Link to="/dashboard" className="text-indigo-600 font-bold hover:underline flex items-center">
              View All <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-3xl"></div>)}
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic">Waiting for the first proofs to arrive...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl mb-6">
                    {candidate.name ? candidate.name[0] : "A"}
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mb-1">{candidate.name || "Anonymous"}</h3>
                  <p className="text-gray-500 font-medium text-sm mb-4">{candidate.email}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">GitHub</span>
                    <span className="font-mono text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg">
                      @{candidate.github_username || "unlinked"}
                    </span>
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
