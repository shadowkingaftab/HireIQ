import { request } from "./api";

export const matchingApi = {
  rank: (jobId, candidateIds) =>
    request(`/jobs/${jobId}/match`, {
      method: "POST",
      body: JSON.stringify({ candidate_ids: candidateIds }),
    }),
  forJob: (jobId, options = {}) =>
    request(`/jobs/${jobId}/match`, {
      method: "POST",
      body: JSON.stringify(options),
    }),
  history: (jobId) => request(`/jobs/${jobId}/matches`),
  explain: (matchId) => request(`/matches/${matchId}/explain`),
};
