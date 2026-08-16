import { request } from "./api";

export const recruiterApi = {
  dashboard: () => request("/recruiter/dashboard"),
  analytics: () => request("/recruiter/analytics"),
  pipeline: (jobId) => request(`/recruiter/jobs/${jobId}/pipeline`),
};
