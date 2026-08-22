export const assessmentShape = {
  id: "number",
  title: "string",
  description: "string",
  duration_minutes: "number",
  total_score: "number",
};

export const attemptShape = {
  id: "number",
  assessment_id: "number",
  candidate_id: "number",
  score: "number",
  completed: "boolean",
};
