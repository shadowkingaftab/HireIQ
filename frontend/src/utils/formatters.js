export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function formatRelativeTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  const now = new Date();
  const diff = (now - date) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return formatDate(value);
}
