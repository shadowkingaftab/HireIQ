import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useCandidate(id) {
  return useGet(`/candidates/${id}`, ["candidate", id]);
}

export function useCandidates(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return useGet(`/candidates?${params}`, ["candidates", filters]);
}
