import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * ProofHire text input with label, description, error, icon and password
 * variants. Focus styling comes from the global :focus-visible ring plus a
 * per-field border emphasis.
 */
const Input = forwardRef(function Input(
  {
    id,
    label,
    description,
    error,
    type = "text",
    leadingIcon: LeadingIcon,
    trailing,
    disabled = false,
    required = false,
    className = "",
    ...props
  },
  ref
) {
  const autoId = useId();
  const inputId = id || `ph-input-${autoId}`;
  const describedBy = error ? `${inputId}-error` : description ? `${inputId}-desc` : undefined;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";
  const effectiveType = isPassword && revealed ? "text" : type;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-body-sm font-medium text-ink-hi">
          {label}
          {required && (
            <span className="ml-0.5 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-10 w-full rounded-lg border bg-surface-1 px-3 text-body-sm text-ink-hi placeholder:text-ink-faint transition-colors duration-150 ease-out focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted ${
            error ? "border-danger/60" : "border-line-subtle hover:border-line-strong focus:border-intel"
          } ${LeadingIcon ? "pl-9" : ""} ${isPassword || trailing ? "pr-9" : ""}`}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-ink-faint transition-colors hover:text-ink-med"
          >
            {revealed ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
          </button>
        ) : (
          trailing && <div className="absolute right-2.5 top-1/2 -translate-y-1/2">{trailing}</div>
        )}
      </div>

      {description && !error && (
        <p id={`${inputId}-desc`} className="text-meta font-sans text-ink-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-meta font-sans text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
