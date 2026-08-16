import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useAnalytics(organizationId) {
  return useGet(`/organizations/${organizationId}/analytics`, ["analytics", organizationId]);
}
