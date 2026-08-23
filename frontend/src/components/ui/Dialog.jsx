import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOverlay } from "./_useOverlay";

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

/**
 * ProofHire modal. Portal-rendered, scrim click + Escape to close, focus is
 * trapped and restored. Entrance animates via `animate-scale-in`.
 */
export default function Dialog({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) {
  const panelRef = useRef(null);
  useOverlay({ open, onClose, panelRef });

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-scrim"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`panel-raised relative flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-card ${sizes[size]} animate-scale-in`}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-line-subtle px-5 py-4">
            <div>
              {title && <h2 className="text-section text-ink-hi">{title}</h2>}
              {description && (
                <p className="mt-0.5 text-body-sm text-ink-muted">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 -mt-1 rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-hi"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-line-subtle bg-surface-1 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
