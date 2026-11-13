import { API_BASE_URL } from "../utils/constants";

export async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  let res;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    const err = new Error("Network error — check your connection and try again.");
    err.status = 0;
    throw err;
  }
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    // FastAPI style { detail } or generic { message }
    const detail = error.detail ?? error.message;
    const err = new Error(typeof detail === "string" ? detail : "Request failed");
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

export const authApi = {
  login: (credentials) => request("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  signup: (data) => request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),
  me: () => request("/auth/me"),
};

export const candidateApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/candidates?${params}`);
  },
  get: (id) => request(`/candidates/${id}`),
  create: (data) => request("/candidates", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/candidates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

export const evidenceApi = {
  listForCandidate: (candidateId) => request(`/evidence/candidates/${candidateId}`),
  ingestForCandidate: (candidateId, data) =>
    request(`/evidence/candidates/${candidateId}`, { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/evidence/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const jobApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/jobs?${params}`);
  },
  get: (id) => request(`/jobs/${id}`),
  create: (data) => request("/jobs", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/jobs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

export const matchingApi = {
  forJob: (jobId, payload = {}) =>
    request(`/matching/jobs/${jobId}/match`, { method: "POST", body: JSON.stringify(payload) }),
};

export const searchApi = {
  global: (query) => request("/search", { method: "POST", body: JSON.stringify(query) }),
};

export const skillsApi = {
  list: () => request("/skills"),
  query: (query) => request("/skills/query", { method: "POST", body: JSON.stringify(query) }),
  graphForOrg: (organizationId) => request(`/skill-graph/organizations/${organizationId}`),
};

export const notificationsApi = {
  list: () => request("/notifications"),
  markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" }),
};

export const assessmentApi = {
  list: () => request("/assessments"),
  get: (id) => request(`/assessments/${id}`),
  create: (data) => request("/assessments", { method: "POST", body: JSON.stringify(data) }),
  results: (id) => request(`/assessments/${id}/results`),
};

export const applicationApi = {
  list: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/applications?${params}`);
  },
  create: (data) => request("/applications", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/applications/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
};

export const recruiterApi = {
  dashboard: () => request("/recruiter/dashboard"),
  analytics: () => request("/recruiter/analytics"),
};

export const organizationApi = {
  settings: () => request("/organizations/settings"),
  updateSettings: (data) => request("/organizations/settings", { method: "PUT", body: JSON.stringify(data) }),
};

export const integrationApi = {
  list: () => request("/integrations"),
  update: (id, data) => request(`/integrations/${id}`, { method: "PUT", body: JSON.stringify(data) }),
};

export const analyticsApi = {
  summary: (organizationId) => request(`/analytics/organizations/${organizationId}/summary`),
};

export const adminApi = {
  stats: () => request("/admin/stats"),
};
