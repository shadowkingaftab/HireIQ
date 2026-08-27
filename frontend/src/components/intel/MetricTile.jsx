import { forwardRef } from "react";

/**
 * Meaningful-metric tile. Every metric answers a question:
 *   question  — what this number answers (renders as the label)
 *   value     — the number itself (mono, tabular)
 *   context   — the qualifier that makes the number meaningful
 *   trend     — optional { direction: up|down|flat, label }
 */
const toneStyles = {
  default: "text-ink-hi",
  intel: "text-intel",
  verified: "text-verified",
  caution: "text-caution",
  danger: "text-danger",
};

const trendGlyph = { up: "▲", down: "▼", flat: "—" };
const trendTone = {
  up: "text-verified",
  down: "text-danger",
  flat: "text-ink-faint",
};

const MetricTile = forwardRef(function MetricTile(
  {
    question,
    value,
    context,
    icon: Icon,
    tone = "default",
    trend,
    size = "md",
    className = "",
    ...props
  },
  ref
) {
  return (
    <div
      ref={ref}
      className={`panel relative flex flex-col gap-2 p-5 ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-meta font-sans text-ink-muted">{question}</p>
        {Icon && (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-subtle bg-surface-2 text-ink-faint">
            <Icon size={14} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2.5">
        <span
          className={`numeric font-mono font-semibold tracking-tight ${
            size === "lg" ? "text-display" : "text-section"
          } ${toneStyles[tone] || toneStyles.default}`}
        >
          {value}
        </span>
        {trend && (
          <span className={`text-micro font-medium ${trendTone[trend.direction] || trendTone.flat}`}>
            <span aria-hidden="true">{trendGlyph[trend.direction] || trendGlyph.flat}</span>{" "}
            {trend.label}
          </span>
        )}
      </div>
      {context && <p className="text-meta leading-snug text-ink-faint">{context}</p>}
    </div>
  );
});

export default MetricTile;
