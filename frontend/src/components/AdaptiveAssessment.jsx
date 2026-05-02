import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DIFFICULTY_LEVELS = ["easy", "medium", "hard"];

export default function AdaptiveAssessment({ skill, onComplete }) {
  const [assessment, setAssessment] = useState(null);
  const [currentDifficulty, setCurrentDifficulty] = useState('medium');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchAdaptiveAssessment(null);
  }, [skill]);

  const fetchAdaptiveAssessment = async (passed = null) => {
    setFetching(true);
    setResult(null);
    setCode('');
    try {
      const url = passed !== null 
        ? `http://localhost:8000/assessments/adaptive/${skill}?current_difficulty=${currentDifficulty}&passed=${passed}`
        : `http://localhost:8000/assessments/adaptive/${skill}?current_difficulty=${currentDifficulty}`;
      
      const response = await axios.get(url);
      setAssessment(response.data);
      setCurrentDifficulty(response.data.next_difficulty);
    } catch (error) {
      console.error("Error fetching adaptive assessment:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/assessments/grade",
        {
          assessment_id: assessment.problem,
          code
        }
      );
      
      const gradeResult = response.data;
      setResult(gradeResult);
      
      // Add to history
      setHistory(prev => [...prev, {
        difficulty: currentDifficulty,
        passed: gradeResult.passed,
        score: gradeResult.score
      }]);

      if (onComplete) onComplete(gradeResult);
    } catch (error) {
      console.error("Error grading assessment:", error);
      alert("Error grading solution.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextChallenge = () => {
    fetchAdaptiveAssessment(result.passed);
  };

  if (fetching) return (
    <div className="mt-6 p-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-gray-500 font-medium italic">Adjusting difficulty for {skill}...</p>
    </div>
  );

  if (!assessment) return (
    <div className="mt-6 p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
      <p className="text-red-700 font-medium">No adaptive assessment available for {skill}.</p>
    </div>
  );

  return (
    <div className="mt-6 p-8 bg-white rounded-2xl shadow-xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Adaptive {skill} Challenge
          </h3>
          <p className="text-sm text-gray-500 font-medium">Progressive Skill Validation</p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
            currentDifficulty === 'easy' ? 'bg-green-100 text-green-700' : 
            currentDifficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
          }`}>
            Difficulty: {currentDifficulty}
          </span>
          <div className="flex mt-2 gap-1">
            {history.map((h, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${h.passed ? 'bg-green-500' : 'bg-red-500'}`} title={`${h.difficulty}: ${h.score}%`}></div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">The Problem</label>
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 leading-relaxed font-medium">
          {assessment.problem}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Your Solution (Python)</label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-4 border border-gray-200 rounded-xl h-48 font-mono text-sm bg-gray-900 text-green-400 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          placeholder="# Write your Python function here..."
          disabled={result !== null}
        />
      </div>

      <div className="flex flex-col items-center">
        {!result ? (
          <button
            onClick={handleSubmit}
            disabled={loading || !code.trim()}
            className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg transition-all transform hover:scale-[1.01] active:scale-95 ${
              loading || !code.trim() ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Grading..." : "Submit Solution"}
          </button>
        ) : (
          <div className="w-full">
            <div className={`p-6 rounded-xl border animate-in zoom-in duration-300 ${
              result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
            }`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold uppercase tracking-wider text-gray-500">Result</span>
                <span className={`text-2xl font-black ${result.passed ? "text-green-600" : "text-red-600"}`}>
                  {result.score}%
                </span>
              </div>
              <p className={`font-bold flex items-center ${result.passed ? "text-green-700" : "text-red-700"}`}>
                {result.passed ? (
                  <><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> Perfect! Increasing difficulty for next round.</>
                ) : (
                  <><svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg> {result.passed_tests}/{result.total_tests} passed. Let's try an easier one.</>
                )}
              </p>
            </div>
            <button
              onClick={handleNextChallenge}
              className="mt-4 w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
            >
              Continue to Next Challenge
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
