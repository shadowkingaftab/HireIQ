const kindIcons = {
  evidence_verified: { glyph: "✓", cls: "text-verified border-verified/40" },
  assessment_completed: { glyph: "◎", cls: "text-verified border-verified/40" },
  assessment_progress: { glyph: "◔", cls: "text-intel border-intel/40" },
  match_received: { glyph: "◈", cls: "text-intel border-intel/40" },
  profile_view: { glyph: "◉", cls: "text-signal border-signal/40" },
  evidence_added: { glyph: "+", cls: "text-ink-med border-line-strong" },
  stage_change: { glyph: "→", cls: "text-intel border-intel/40" },
};

/** Vertical activity timeline — mono timestamps, quiet glyphs. */
export default function Timeline({ items = [], className = "" }) {
  if (!items.length) return null;
  return (
    <ol role="list" className={`relative flex flex-col ${className}`}>
      {items.map((item, i) => {
        const cfg = kindIcons[item.kind] || kindIcons.evidence_added;
        return (
          <li key={item.id} className="relative flex gap-4 pb-6 last:pb-0">
            {i < items.length - 1 && (
              <span aria-hidden="true" className="absolute left-[13px] top-8 h-[calc(100%-24px)] w-px bg-line-subtle" />
            )}
            <span
              aria-hidden="true"
              className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border bg-canvas text-meta ${cfg.cls}`}
            >
              {cfg.glyph}
            </span>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <p className="text-body-sm font-medium text-ink-hi">{item.title}</p>
                <time dateTime={item.at} className="numeric shrink-0 font-mono text-micro text-ink-faint">
                  {new Date(item.at).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </time>
              </div>
              <p className="mt-0.5 text-meta leading-snug text-ink-muted">{item.detail}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
