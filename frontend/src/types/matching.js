export const matchingResultShape = {
  job_id: "number",
  candidate_id: "number",
  score: "number",
  reasoning: "object",
  matched_skills: "array",
  missing_skills: "array",
};

export const matchingRequestShape = {
  job_id: "number",
  candidate_ids: "array",
  limit: "number",
};
