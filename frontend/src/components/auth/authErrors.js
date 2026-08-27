/**
 * Maps service-layer failures to calm, honest user-facing messages.
 * The backend auth router currently returns 501 for /login and has no
 * /signup route — this keeps those states understandable instead of raw.
 */
export function describeAuthError(error) {
  const status = error?.status ?? null;
  const message = typeof error?.message === "string" ? error.message : "";

  if (status === 0) {
    return "Can't reach the server. Check your connection and try again.";
  }
  if (status === 400 || status === 401 || status === 403) {
    return "Those credentials don't match an account. Please check and try again.";
  }
  if (status === 429) {
    return "Too many attempts. Wait a moment and try again.";
  }
  if (status >= 500 || status === 404 || status === 501) {
    return "Authentication isn't available right now. The service may not be enabled yet — please try again shortly.";
  }
  return message || "Something went wrong. Please try again.";
}
