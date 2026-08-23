import { AlertTriangle } from "lucide-react";
import Button from "./Button";

/**
 * Error presentation consistent with the ProofHire system. Optional retry
 * action; message text is expected to be user-safe (no raw stack traces).
 */
export default function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred. You can retry or return later.",
  onRetry,
  retryLabel = "Try again",
  compact = false,
  className = "",
  ...props
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-card border border-danger/20 bg-danger-soft/40 px-6 ${compact ? "py-8" : "py-12"} text-center ${className}`}
      {...props}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-danger/25 bg-surface-1 text-danger">
        <AlertTriangle size={20} aria-hidden="true" />
      </div>
      <div className="max-w-sm">
        <h3 className="text-section-sm text-ink-hi">{title}</h3>
        <p className="mt-1 text-body-sm text-ink-med">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
