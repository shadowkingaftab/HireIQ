import { request } from "./api";

export const skillGraphApi = {
  getGraph: () => request("/skill-graph"),
  getNode: (skillId) => request(`/skill-graph/nodes/${skillId}`),
  getRelated: (skillId) => request(`/skill-graph/nodes/${skillId}/related`),
  search: (query) => request(`/skill-graph/search?q=${encodeURIComponent(query)}`),
};
