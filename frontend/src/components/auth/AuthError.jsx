import { AlertTriangle } from "lucide-react";

/**
 * Inline server-error presentation for auth forms. Announced via role=alert.
 */
export default function AuthError({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-danger/25 bg-danger-soft/50 px-3.5 py-3 animate-fade-in"
    >
      <AlertTriangle size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
      <p className="text-meta font-sans leading-relaxed text-ink-hi">{message}</p>
    </div>
  );
}
