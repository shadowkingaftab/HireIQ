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

export const skillGraphQueryShape = {
  skill_names: "array",
  depth: "number",
};
