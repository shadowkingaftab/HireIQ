export function formatScore(value) {
  if (value === null || value === undefined) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
