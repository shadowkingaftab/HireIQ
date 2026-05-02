import React from 'react';
import SuccessAnimation from './SuccessAnimation';

export default function ResultsDashboard({ results }) {
  if (!results) return null;

  const { fit_score, semantic_similarity, matched_skills, missing_skills, skill_confidence, trainability } = results;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      {/* Success Animation */}
      {fit_score > 70 && (
        <SuccessAnimation message={`Excellent Match: ${fit_score}%`} />
      )}
      
      {/* 1. Main Score Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-2xl text-white">
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-blue-100 uppercase font-bold text-xs tracking-widest mb-1">Overall Capability Match</p>
            <div className="text-7xl font-black">{fit_score}%</div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 uppercase font-bold text-xs tracking-widest mb-1">Semantic Similarity</p>
            <div className="text-2xl font-bold">{semantic_similarity}%</div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm font-bold mb-2">
              <span>MATCH STRENGTH</span>
              <span>{fit_score > 80 ? "EXCELLENT" : fit_score > 60 ? "STRONG" : "MODERATE"}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white rounded-full h-3 transition-all duration-1000 ease-out" 
                style={{ width: `${fit_score}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Skill Confidence Breakdown */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Proof Layer: Skill Confidence
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {Object.entries(skill_confidence).sort((a, b) => b[1] - a[1]).map(([skill, conf]) => (
            <div key={skill} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors">{skill}</span>
                <span className={`font-bold ${conf > 0.7 ? "text-green-600" : conf > 0.4 ? "text-blue-600" : "text-gray-500"}`}>
                  {Math.round(conf * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`rounded-full h-1.5 transition-all duration-500 ${
                    conf > 0.7 ? "bg-green-500" : conf > 0.4 ? "bg-blue-500" : "bg-gray-400"
                  }`}
                  style={{ width: `${conf * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Trainability - Predict Learning Path */}
      {trainability && Object.keys(trainability).length > 0 && (
        <div className="bg-amber-50 p-8 rounded-2xl border border-amber-100">
          <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-2 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Trainability & Learning Path
          </h3>
          <div className="space-y-4">
            {Object.entries(trainability).map(([skill, data]) => (
              <div key={skill} className="bg-white/60 p-4 rounded-xl border border-amber-200 shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{skill}</span>
                  <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-bold">
                    ~{data.time_weeks} WEEK{data.time_weeks !== 1 ? 'S' : ''}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {data.based_on.length > 0 
                    ? `Leveraging your experience in ${data.based_on.join(", ")}.`
                    : "No direct skill overlap found. Standard learning path applies."}
                </p>
                <div className="flex items-center">
                  <span className="text-xs font-bold text-gray-400 mr-2 uppercase tracking-tighter">Confidence</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-1.5 rounded-full transition-all duration-700" 
                      style={{ width: `${data.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Matched/Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
          <h4 className="text-green-800 font-bold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Matched Required
          </h4>
          <div className="flex flex-wrap gap-2">
            {matched_skills.required.map(skill => (
              <span key={skill} className="bg-white text-green-700 px-3 py-1 rounded-lg text-xs font-bold border border-green-200 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
          <h4 className="text-red-800 font-bold mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Missing Required
          </h4>
          <div className="flex flex-wrap gap-2">
            {missing_skills.required.map(skill => (
              <span key={skill} className="bg-white text-red-700 px-3 py-1 rounded-lg text-xs font-bold border border-red-200 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
