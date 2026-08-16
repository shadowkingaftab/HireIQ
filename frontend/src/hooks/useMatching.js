import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useMatching(jobId, candidateIds = []) {
  const params = new URLSearchParams({ candidate_ids: candidateIds.join(",") }).toString();
  return useGet(`/jobs/${jobId}/match?${params}`, ["matching", jobId, candidateIds]);
}
