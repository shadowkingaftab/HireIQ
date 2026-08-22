import { useQuery } from "@tanstack/react-query";
import { useGet } from "./useApi";

export function useAssessment(id) {
  return useGet(`/assessments/${id}`, ["assessment", id]);
}

export function useAssessmentResults(assessmentId) {
  return useGet(`/assessments/${assessmentId}/results`, ["assessment-results", assessmentId]);
}
