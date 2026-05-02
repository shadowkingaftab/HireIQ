import { useState } from "react";
import UploadResume from "../components/UploadResume";
import InputGitHub from "../components/InputGitHub";
import InputJD from "../components/InputJD";
import ResultsDashboard from "../components/ResultsDashboard";
import SkillGraph from "../components/SkillGraph";
import AdaptiveAssessment from "../components/AdaptiveAssessment";
import OnboardingTour from "../components/OnboardingTour";
import api from "../services/api";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [jdData, setJdData] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [skillGraph, setSkillGraph] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [error, setError] = useState(null);
  const [runTour, setRunTour] = useState(false);

  const handleMatch = async () => {
    if (!resumeData || !jdData) {
      alert("Please upload a resume and extract JD requirements first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // 1. Calculate Match
      const response = await api.post("/match", {
        candidate_data: {
          skills: resumeData.skills,
          experience: resumeData.experience
        },
        jd_data: {
          required_skills: jdData.required_skills,
          nice_to_have_skills: jdData.nice_to_have_skills
        },
        github_data: githubData
      });
      setMatchResult(response.data);

      // 2. Build Skill Graph (using an arbitrary candidate ID for now)
      const candidateId = githubData?.username || "current-user";
      const graphResponse = await api.post(`/skill-graph/${candidateId}`, {
        skills: resumeData.skills,
        github_data: githubData
      });
      setSkillGraph(graphResponse.data);

    } catch (err) {
      console.error("Error matching:", err);
      setError("Failed to calculate match score. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = (skill) => {
    setCurrentSkill(skill);
    setShowAssessment(true);
    // Scroll to top or to the assessment component
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <OnboardingTour run={runTour} setRun={setRunTour} />
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center relative">
          <button 
            onClick={() => setRunTour(true)}
            className="absolute right-0 top-0 bg-white border border-gray-200 p-3 rounded-2xl shadow-sm hover:shadow-md transition group"
            title="Start Onboarding Tour"
          >
            <svg className="w-6 h-6 text-indigo-600 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
          <h1 className="text-5xl font-black text-gray-900 mb-3 tracking-tight">Proof Dashboard</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Verifiable capability analysis powered by AI and real-world proof.
          </p>
        </header>

        {showAssessment && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={() => setShowAssessment(false)}
                className="text-blue-600 font-bold flex items-center hover:underline"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                Back to Analysis
              </button>
            </div>
            <AdaptiveAssessment 
              skill={currentSkill} 
              onComplete={(res) => console.log("Adaptive Assessment completed:", res)} 
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar: Inputs (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 upload-resume-section">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                Evidence
              </h2>
              <div className="space-y-6">
                <div className="upload-resume-section">
                  <UploadResume onParse={setResumeData} setLoading={setLoading} />
                </div>
                <div className="github-input-section">
                  <InputGitHub onFetch={setGithubData} setLoading={setLoading} />
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 jd-input-section">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                Target
              </h2>
              <InputJD onParse={setJdData} setLoading={setLoading} />
            </section>

            <button
              onClick={handleMatch}
              disabled={loading || !resumeData || !jdData}
              className={`w-full py-5 rounded-2xl font-bold text-xl text-white shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 analyze-button ${
                loading || !resumeData || !jdData
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
              }`}
            >
              {loading ? "Analyzing..." : "Generate Proof Match"}
            </button>

            {matchResult && (
              <div className="bg-indigo-900 p-8 rounded-3xl text-white shadow-xl validate-skills-section">
                <h3 className="text-lg font-bold mb-4">Validate Your Skills</h3>
                <p className="text-indigo-200 text-sm mb-6">
                  Improve your confidence scores by taking micro-assessments for your top skills.
                </p>
                <div className="space-y-3">
                  {matchResult.matched_skills.required.slice(0, 3).map(skill => (
                    <button
                      key={skill}
                      onClick={() => startAssessment(skill)}
                      className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition flex justify-between items-center px-4"
                    >
                      <span>{skill} Assessment</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main: Analysis (8 cols) */}
          <div className="lg:col-span-8">
            {matchResult ? (
              <div className="space-y-8 results-dashboard">
                <ResultsDashboard results={matchResult} />
                {skillGraph && <SkillGraph data={skillGraph} />}
              </div>
            ) : (
              <div className="h-full min-h-[600px] bg-white rounded-[40px] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready for Analysis</h2>
                <p className="text-gray-500 max-w-sm">
                  Upload your resume and provide a target job description to generate your dynamic capability dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
