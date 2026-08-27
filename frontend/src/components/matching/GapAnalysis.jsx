import { CircleAlert, AlertTriangle } from "lucide-react";
import Button from "../ui/Button";

const severityIcon = {
  danger: CircleAlert,
  warning: AlertTriangle,
  caution: AlertTriangle,
};

/**
 * "What would move this candidate?" — actionable gap list.
 * Each gap names the signal that's thin and what closes it.
 */
export default function GapAnalysis({ gaps = [], onAction, actionLabel = "Suggest assessment", className = "" }) {
  if (!gaps.length) {
    return (
      <p className="rounded-lg border border-verified/20 bg-verified-soft/30 px-3.5 py-3 text-body-sm text-ink-med">
        No material gaps — every weighted requirement has evidence at or above the bar.
      </p>
    );
  }
  return (
    <ul role="list" className={`flex flex-col gap-2.5 ${className}`}>
      {gaps.map((gap) => {
        const Icon = severityIcon[gap.severity] || CircleAlert;
        return (
          <li
            key={gap.area}
            className="flex items-start justify-between gap-4 rounded-lg border border-line-subtle bg-surface-1/60 px-3.5 py-3"
          >
            <div className="flex items-start gap-2.5">
              <Icon size={14} aria-hidden="true" className={`mt-0.5 shrink-0 ${gap.severity === "danger" ? "text-danger" : "text-caution"}`} />
              <div>
                <p className="text-body-sm font-medium text-ink-hi">{gap.area}</p>
                <p className="mt-0.5 text-meta leading-snug text-ink-muted">{gap.detail}</p>
              </div>
            </div>
            {onAction && (
              <Button size="sm" variant="ghost" onClick={() => onAction(gap)} className="shrink-0">
                {actionLabel}
              </Button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
