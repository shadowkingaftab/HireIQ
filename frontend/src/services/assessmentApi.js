import { request } from "./api";

export const assessmentApi = {
  list: () => request("/assessments"),
  get: (id) => request(`/assessments/${id}`),
  create: (data) => request("/assessments", { method: "POST", body: JSON.stringify(data) }),
  results: (id) => request(`/assessments/${id}/results`),
  submit: (id, data) =>
    request(`/assessments/${id}/submit`, { method: "POST", body: JSON.stringify(data) }),
};
