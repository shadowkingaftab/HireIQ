import { request } from "./api";

export const evidenceApi = {
  list: (candidateId) => request(`/evidence/candidates/${candidateId}`),
  listForCandidate: (candidateId) => request(`/evidence/candidates/${candidateId}`),
  ingest: (candidateId, data) =>
    request(`/evidence/candidates/${candidateId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/evidence/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  verify: (evidenceId) =>
    request(`/evidence/${evidenceId}/verify`, { method: "POST" }),
};
