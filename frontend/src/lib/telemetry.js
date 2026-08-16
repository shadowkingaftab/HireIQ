let enabled = false;

export function initTelemetry() {
  enabled = true;
}

export function trackEvent(name, properties = {}) {
  if (!enabled) return;
  // placeholder telemetry hook
}

export function trackError(error) {
  if (!enabled) return;
  // placeholder error tracking
}
