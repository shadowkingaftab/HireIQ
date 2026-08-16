import { request } from "./api";

export const jobApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/jobs?${params}`);
  },
  get: (id) => request(`/jobs/${id}`),
  create: (data) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/jobs/${id}`, { method: "DELETE" }),
};
