import { request } from "./api";

export const matchingApi = {
  rank: (jobId, candidateIds) =>
    request(`/jobs/${jobId}/match`, {
      method: "POST",
      body: JSON.stringify({ candidate_ids: candidateIds }),
    }),
  explain: (matchId) => request(`/matches/${matchId}/explain`),
  history: (jobId) => request(`/jobs/${jobId}/matches`),
};
