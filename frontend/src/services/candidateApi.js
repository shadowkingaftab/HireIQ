import { request } from "./api";

export const candidateApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/candidates?${params}`);
  },
  get: (id) => request(`/candidates/${id}`),
  create: (data) => request("/candidates", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/candidates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id) => request(`/candidates/${id}`, { method: "DELETE" }),
};
