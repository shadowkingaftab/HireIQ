export const evidenceShape = {
  id: "number",
  candidate_id: "number",
  type: "string",
  external_id: "string",
  content: "object",
  verified: "boolean",
};

export const normalizedEvidenceShape = {
  source: "string",
  type: "string",
  content: "object",
  raw_id: "string",
  timestamp: "string",
};
