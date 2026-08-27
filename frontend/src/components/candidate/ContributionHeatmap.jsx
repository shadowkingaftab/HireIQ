import Tooltip from "../ui/Tooltip";

/**
 * 52-week contribution heatmap from evidence activity.
 * Values are relative intensity; weeks render left→right, days stacked.
 */
export default function ContributionHeatmap({ heat = [], className = "" }) {
  const weeks = [];
  for (let i = 0; i < heat.length; i += 7) {
    weeks.push(heat.slice(i, i + 7));
  }
  const max = Math.max(...heat, 1);

  const level = (v) => (v === 0 ? 0 : v / max <= 0.25 ? 1 : v / max <= 0.5 ? 2 : v / max <= 0.75 ? 3 : 4);
  const cellClass = [
    "bg-surface-3",
    "bg-intel/20",
    "bg-intel/40",
    "bg-intel/65",
    "bg-intel",
  ];

  return (
    <figure className={`panel p-5 ${className}`}>
      <figcaption className="mb-1 text-micro font-medium uppercase tracking-caps text-intel">
        Contribution history
      </figcaption>
      <p className="mb-4 text-meta text-ink-muted">
        Verified engineering activity feeding the proof graph — commit and contribution density over the last year.
      </p>
      <div className="overflow-x-auto pb-1">
        <div
          className="grid w-max grid-flow-col gap-[3px]"
          style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
          role="img"
          aria-label="Contribution heatmap: darker cells indicate more verified contributions that week"
        >
          {weeks.map((week, wi) =>
            week.map((v, di) => (
              <Tooltip key={`${wi}-${di}`} content={`${v} contributions`}>
                <span className={`block h-3 w-3 rounded-[3px] ${cellClass[level(v)]}`} />
              </Tooltip>
            ))
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-micro text-ink-faint">
        less
        {cellClass.map((c) => (
          <span key={c} aria-hidden="true" className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
        ))}
        more
      </div>
    </figure>
  );
}
