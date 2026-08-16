export const candidateShape = {
  id: "number",
  user_id: "number",
  organization_id: "number",
  summary: "string",
  skills: "array",
  experience_years: "number",
};

export const matchingResultShape = {
  job_id: "number",
  candidate_id: "number",
  score: "number",
  reasoning: "object",
  matched_skills: "array",
  missing_skills: "array",
};

export const evidenceShape = {
  id: "number",
  candidate_id: "number",
  type: "string",
  external_id: "string",
  content: "object",
  verified: "boolean",
};

export const graphNodeShape = {
  id: "string",
  label: "string",
  properties: "object",
};

export const graphEdgeShape = {
  source: "string",
  target: "string",
  type: "string",
  properties: "object",
};

export const assessmentShape = {
  id: "number",
  title: "string",
  description: "string",
  duration_minutes: "number",
  total_score: "number",
};
