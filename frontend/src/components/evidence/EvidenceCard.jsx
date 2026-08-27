import Badge from "../ui/Badge";
import EvidenceSourceBadge from "./EvidenceSourceBadge";
import VerificationBadge from "./VerificationBadge";

const typeIcons = {
  repository: { icon: "⌥", label: "Repository" },
  assessment: { icon: "◈", label: "Assessment" },
  contribution: { icon: "⑃", label: "Contribution" },
  publication: { icon: "❞", label: "Publication" },
  certification: { icon: "❖", label: "Certification" },
  work_history: { icon: "▤", label: "Work history" },
};

const strengthTone = { strong: "strong", moderate: "moderate", weak: "weak" };

/**
 * A single evidence artifact in list/grid contexts.
 * The evidence ID is mono and copyable — provenance is a first-class citizen.
 */
export default function EvidenceCard({ evidence, onInspect, compact = false, className = "", ...props }) {
  const type = typeIcons[evidence.type] || typeIcons.repository;

  const onCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(evidence.id).catch(() => {});
  };

  return (
    <article
      tabIndex={0}
      role="button"
      aria-label={`Inspect evidence ${evidence.id}: ${evidence.title}`}
      onClick={() => onInspect?.(evidence)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onInspect?.(evidence);
        }
      }}
      className={`group cursor-pointer rounded-panel border border-line-subtle bg-surface-1/70 p-4 transition-all duration-150 hover:border-line-strong hover:bg-surface-1 hover:shadow-card focus-visible:border-intel focus-visible:outline-none ${
        compact ? "space-y-2" : "space-y-3"
      } ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line-subtle bg-surface-2 text-meta text-ink-muted"
          >
            {type.icon}
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-body-sm font-medium leading-snug text-ink-hi group-hover:text-intel">
              {evidence.title}
            </h3>
            <p className="text-micro text-ink-faint">{type.label}</p>
          </div>
        </div>
        <VerificationBadge evidence={evidence} />
      </div>

      {!compact && (
        <p className="line-clamp-2 text-meta leading-relaxed text-ink-muted">{evidence.summary}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <EvidenceSourceBadge source={evidence.source} />
        <Badge tone={strengthTone[evidence.strength] || "neutral"} size="sm">
          {evidence.strength} evidence
        </Badge>
        <button
          type="button"
          onClick={onCopyId}
          title="Copy evidence ID"
          className="numeric rounded px-1 font-mono text-micro text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-med focus-visible:outline-none"
        >
          {evidence.id}
        </button>
        <span className="ml-auto numeric font-mono text-micro text-ink-faint">
          conf {evidence.confidence}
        </span>
      </div>

      {evidence.skills?.length > 0 && (
        <ul role="list" aria-label="Skills this evidence supports" className="flex flex-wrap gap-1.5">
          {evidence.skills.map((s) => (
            <li
              key={s}
              className="rounded border border-line-subtle bg-surface-2/60 px-1.5 py-0.5 text-micro text-ink-muted"
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
