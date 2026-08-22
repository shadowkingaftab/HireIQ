import { request } from "./api";

export const applicationApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/applications?${params}`);
  },
  create: (data) => request("/applications", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  get: (id) => request(`/applications/${id}`),
};
