import { request } from "./api";

export const analyticsApi = {
  summary: (organizationId) =>
    request(`/organizations/${organizationId}/analytics/summary`),
  hiringFunnel: (organizationId) =>
    request(`/organizations/${organizationId}/analytics/funnel`),
  skillDemand: (organizationId) =>
    request(`/organizations/${organizationId}/analytics/skill-demand`),
};
