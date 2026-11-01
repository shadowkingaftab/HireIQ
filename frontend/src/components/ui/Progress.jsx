const barTones = {
  intel: "bg-intel",
  verified: "bg-verified",
  caution: "bg-caution",
  danger: "bg-danger",
  signal: "bg-signal",
};

function clamp(value) {
  return Math.min(100, Math.max(0, value));
}

/** Standard linear progress. */
export function Progress({ value = 0, tone = "intel", label, className = "", ...props }) {
  const pct = clamp(value);
  return (
    <div
      className={`flex flex-col gap-1.5 ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...props}
    >
      {label && (
        <div className="flex items-baseline justify-between">
          <span className="text-meta font-sans text-ink-med">{label}</span>
          <span className="numeric text-micro text-ink-muted">{pct}%</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${barTones[tone] || barTones.intel}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const ringTones = {
  intel: "--ph-intel",
  accent: "--ph-accent",
  verified: "--ph-verified",
  caution: "--ph-caution",
  danger: "--ph-danger",
  signal: "--ph-signal",
};

/**
 * Circular score indicator — the canonical match/capability score display.
 * Value renders in mono with tabular alignment per the design system.
 */
export function ScoreRing({ value = 0, size = 72, tone = "intel", label, className = "" }) {
  const pct = clamp(value);
  const stroke = Math.max(4, Math.round(size / 18));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const strokeColor = `hsl(var(${ringTones[tone] || ringTones.intel}) / 0.9)`;

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      role="img"
      aria-label={label ? `${label}: ${pct} out of 100` : `${pct} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-surface-3"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={strokeColor}
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset 700ms cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span         className={`numeric font-mono font-semibold leading-none ${tone === "accent" ? "score-accent" : "text-ink-hi"}`} style={{ fontSize: size / 4 }}>
          {pct}
        </span>
        {label && (
          <span className="mt-1 text-micro uppercase tracking-caps text-ink-faint">{label}</span>
        )}
      </div>
    </div>
  );
}

/**
 * Confidence visualization: filled confidence plus an optional uncertainty
 * band rendered in the caution tone. Used wherever ProofHire expresses how
 * sure it is — uncertainty is shown, never hidden.
 */
export function ConfidenceBar({
  value = 0,
  uncertainty = 0,
  label,
  className = "",
  ...props
}) {
  const pct = clamp(value);
  const unc = clamp(uncertainty);
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} {...props}>
      {(label || uncertainty > 0) && (
        <div className="flex items-baseline justify-between">
          {label && <span className="text-meta font-sans text-ink-med">{label}</span>}
          {uncertainty > 0 && (
            <span className="text-micro uppercase tracking-caps text-caution">
              ±{clamp(uncertainty)}% uncertainty
            </span>
          )}
        </div>
      )}
      <div
        className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-3"
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || "Confidence"}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-intel transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <div
          className="absolute inset-y-0 rounded-full bg-caution/45"
          style={{ left: `${pct}%`, width: `${unc}%` }}
        />
      </div>
    </div>
  );
}

/** Backwards-compatible default export. */
export default Progress;
