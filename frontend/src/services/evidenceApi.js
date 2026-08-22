import { request } from "./api";

export const evidenceApi = {
  list: (candidateId) => request(`/candidates/${candidateId}/evidence`),
  ingest: (candidateId, data) =>
    request(`/candidates/${candidateId}/evidence`, { method: "POST", body: JSON.stringify(data) }),
  verify: (evidenceId) =>
    request(`/evidence/${evidenceId}/verify`, { method: "POST" }),
};
