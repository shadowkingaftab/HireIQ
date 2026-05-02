import React from 'react';

export default function CandidateProfile({ candidateName, skills, githubData }) {
  
  // Logic translated from backend snippet for frontend visualization mapping if needed
  // Alternatively, just use the pre-calculated backend score. The backend now calculates this.
  const calculateSkillRecency = (skill) => {
    const lastUsedStr = githubData?.last_commit_dates?.[skill];
    if (!lastUsedStr) return 0.5; // Default

    const lastUsed = new Date(lastUsedStr);
    const now = new Date();
    const monthsSinceUse = (now - lastUsed) / (1000 * 60 * 60 * 24 * 30);
    return Math.max(0.1, 1 - (monthsSinceUse * 0.1));
  };

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl mt-6 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {candidateName ? `${candidateName}'s Profile` : 'Candidate Profile'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* GitHub Repository Quality */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub Activity & Quality
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {githubData?.repos?.length > 0 ? (
              githubData.repos.map(repo => (
                <div key={repo.name} className="p-3 bg-white border border-gray-200 rounded-md shadow-sm transition-all hover:shadow-md">
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-semibold hover:underline">
                    {repo.name}
                  </a>
                  
                  <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1" title="Stars">⭐ {repo.stars}</span>
                      <span className="flex items-center gap-1" title="Forks">🍴 {repo.forks}</span>
                    </div>
                    
                    {/* Quality Badge */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Quality:</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${repo.quality_score >= 70 ? 'bg-green-500' : repo.quality_score >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${repo.quality_score || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{repo.quality_score || 0}%</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No public repositories found or analyzed.</p>
            )}
          </div>
        </div>

        {/* Skill Recency */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
             ⏱️ Skill Recency
          </h3>
          
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {skills?.length > 0 ? (
              skills.map(skill => {
                const recencyScore = calculateSkillRecency(skill);
                const percentage = Math.round(recencyScore * 100);
                
                return (
                  <div key={skill} className="flex flex-col gap-1">
                    <div className="flex justify-between items-end">
                      <span className="font-medium text-gray-800">{skill}</span>
                      <span className="text-xs font-semibold text-gray-500">
                        {percentage >= 80 ? 'Very Active' : percentage >= 50 ? 'Moderate' : 'Decaying'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-blue-400' : 'bg-orange-400'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-500 italic">No skills to analyze.</p>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
