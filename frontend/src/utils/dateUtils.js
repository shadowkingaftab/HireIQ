export function isExpired(value) {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
}

export function addDays(value, days) {
  const date = new Date(value);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}
