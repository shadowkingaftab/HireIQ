import { useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useOverlay } from "./_useOverlay";

const widths = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

/**
 * Side drawer for evidence inspection, filters and detail panels.
 * Slides from the right by default; Escape/scrim close, focus trapped.
 */
export default function Drawer({
  open = false,
  onClose,
  title,
  description,
  children,
  footer,
  position = "right",
  width = "md",
}) {
  const panelRef = useRef(null);
  useOverlay({ open, onClose, panelRef });

  if (!open) return null;
  const isRight = position === "right";

  return createPortal(
    <div className="fixed inset-0 z-modal">
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
        className={`absolute bottom-0 top-0 flex w-full ${widths[width]} flex-col border-line-subtle bg-surface-1 shadow-overlay ${
          isRight ? `right-0 animate-slide-in-right border-l` : `left-0 animate-slide-in-left border-r`
        }`}
      >
        {(title || description) && (
          <div className="flex items-start justify-between gap-4 border-b border-line-subtle px-5 py-4">
            <div>
              {title && <h2 className="text-section-sm text-ink-hi">{title}</h2>}
              {description && (
                <p className="mt-0.5 text-body-sm text-ink-muted">{description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="-mr-1 -mt-1 rounded-md p-1.5 text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-hi"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 border-t border-line-subtle bg-surface-2/50 px-5 py-3.5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
