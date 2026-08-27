/**
 * Visible credit/usage meter for a single line item. Answers
 * "am I over budget on this resource?" at a glance.
 */
export default function UsageMeter({ label, used, limit, className = "" }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const tone = pct >= 85 ? "caution" : "intel";
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-meta text-ink-med">{label}</span>
        <span className="numeric font-mono text-micro text-ink-faint">
          {used.toLocaleString()} / {limit.toLocaleString()} ({pct}%)
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-3" role="meter" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label}: ${used} of ${limit}`}>
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${
            tone === "caution" ? "bg-caution" : "bg-intel"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
