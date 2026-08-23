import { CheckCircle2, Info, AlertTriangle, XCircle, X } from "lucide-react";

const tones = {
  info: { icon: Info, iconClass: "text-intel" },
  success: { icon: CheckCircle2, iconClass: "text-verified" },
  warning: { icon: AlertTriangle, iconClass: "text-caution" },
  danger: { icon: XCircle, iconClass: "text-danger" },
};

/**
 * Presentational toast item. State and timers are owned by ToastHost +
 * store/toastStore — this component stays dumb.
 */
export default function Toast({ tone = "info", title, message, onClose }) {
  const { icon: Icon, iconClass } = tones[tone] || tones.info;
  return (
    <div
      role="status"
      className="panel-glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg px-4 py-3 shadow-overlay animate-fade-up"
    >
      <Icon size={17} aria-hidden="true" className={`mt-0.5 shrink-0 ${iconClass}`} />
      <div className="min-w-0 flex-1">
        {title && <p className="text-body-sm font-medium text-ink-hi">{title}</p>}
        {message && (
          <p className={`${title ? "mt-0.5" : ""} text-meta font-sans leading-relaxed text-ink-med`}>
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="-mr-1 -mt-0.5 rounded p-1 text-ink-faint transition-colors hover:text-ink-hi"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
