export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function hasMinLength(value, min) {
  return typeof value === "string" && value.length >= min;
}

export function passwordsMatch(a, b) {
  return typeof a === "string" && a === b;
}
