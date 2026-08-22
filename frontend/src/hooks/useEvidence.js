import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useEvidence(candidateId) {
  return useGet(`/candidates/${candidateId}/evidence`, ["evidence", candidateId]);
}
