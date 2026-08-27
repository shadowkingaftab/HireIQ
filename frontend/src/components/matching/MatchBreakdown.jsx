import Badge from "../ui/Badge";
import Card from "../ui/Card";
import { ConfidenceBar } from "../ui/Progress";
import EvidenceCard from "../evidence/EvidenceCard";
import { AlertTriangle, CircleAlert } from "lucide-react";

/**
 * THE flagship explanation surface.
 *
 * Answers "why does this match exist?" via weighted contributions,
 * supporting evidence, gaps, and explicit uncertainty. Weighted contribution
 * bars render as filled portion × weight of total score.
 */
export default function MatchBreakdown({ match, evidence = [], onInspectEvidence, className = "" }) {
  const parts = [
    { key: "capabilityAlignment", label: "Capability alignment", icon: "◈" },
    { key: "skillCoverage", label: "Skill coverage", icon: "◇" },
    { key: "evidenceQuality", label: "Evidence quality", icon: "▣" },
    { key: "assessmentSignal", label: "Assessment signal", icon: "◎" },
  ];

  const supportingEvidence = evidence.filter((ev) => match.supportingEvidenceIds?.includes(ev.id));

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Weighted contributions */}
      <section aria-label="Weighted score contributions" className="flex flex-col gap-3.5">
        <h3 className="text-micro font-medium uppercase tracking-caps text-intel">How the score was built</h3>
        {parts.map(({ key, label, icon }) => {
          const part = match.breakdown?.[key];
          if (!part) return null;
          const zeroSignal = part.value === 0;
          return (
            <div key={key} className="grid grid-cols-[10.5rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[13rem_1fr]">
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className={zeroSignal ? "text-caution" : "text-intel"}>
                  {icon}
                </span>
                <span className={`truncate text-body-sm ${zeroSignal ? "text-ink-muted" : "text-ink-hi"}`}>{label}</span>
                <span className="numeric shrink-0 font-mono text-micro text-ink-faint">×{part.weight.toFixed(2)}</span>
              </div>
              <div>
                <div
                  className="relative h-2 w-full overflow-hidden rounded-full bg-surface-3"
                  role="meter"
                  aria-valuenow={Math.round(part.value * part.weight)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${label}: contributes ${Math.round(part.value)} of a possible ${part.weight * 100} points`}
                >
                  {/* track shows max possible contribution for this part */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 bg-surface-2/40"
                    style={{ width: `${part.weight * 100}%` }}
                  />
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out ${
                      zeroSignal ? "bg-transparent" : part.value >= 75 ? "bg-verified" : "bg-intel"
                    }`}
                    style={{ width: `${zeroSignal ? 0 : Math.min(part.weight * 100, part.value)}%` }}
                  />
                  {zeroSignal && (
                    <div className="absolute inset-y-0 left-0 w-full animate-pulse rounded-full bg-caution/25" />
                  )}
                </div>
                <p className="mt-1 line-clamp-1 text-meta text-ink-faint">{part.note}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Uncertainty callout */}
      {match.uncertainty > 0 && (
        <section
          aria-label="Uncertainty"
          className="flex items-start gap-2.5 rounded-lg border border-caution/25 bg-caution-soft/30 px-3.5 py-3"
        >
          <CircleAlert size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-caution" />
          <div>
            <p className="text-body-sm font-medium text-ink-hi">
              ±{match.uncertainty}% uncertainty on this match
            </p>
            <p className="mt-0.5 text-meta leading-relaxed text-ink-muted">
              Uncertainty here is information, not noise. It reflects unverified claims and thin coverage — the
              fastest way to shrink it appears under gaps below.
            </p>
          </div>
        </section>
      )}

      {/* Gaps / missing signals */}
      {match.gaps?.length > 0 && (
        <section aria-label="Gaps and weak signals" className="flex flex-col gap-2.5">
          <h3 className="text-micro font-medium uppercase tracking-caps text-caution">Gaps &amp; weak signals</h3>
          {match.gaps.map((gap) => (
            <div
              key={gap.area}
              className="flex items-start gap-3 rounded-lg border border-line-subtle bg-surface-1/60 px-3.5 py-3"
            >
              {gap.severity === "danger" ? (
                <CircleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-danger" />
              ) : (
                <AlertTriangle size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-caution" />
              )}
              <div>
                <p className="text-body-sm font-medium text-ink-hi">{gap.area}</p>
                <p className="mt-0.5 text-meta leading-snug text-ink-muted">{gap.detail}</p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Skill overlap summary */}
      {(match.matchedSkills?.length > 0 || match.missingSkills?.length > 0) && (
        <section aria-label="Skill overlap" className="flex flex-col gap-2.5">
          <h3 className="text-micro font-medium uppercase tracking-caps text-intel">Requirement overlap</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            {match.matchedSkills.map((s) => (
              <Badge key={s} tone="success" size="sm" dot>
                {s}
              </Badge>
            ))}
            {match.missingSkills.map((s) => (
              <Badge key={s} tone="neutral" size="sm" dot>
                {s} · not evidenced
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Supporting evidence */}
      {supportingEvidence.length > 0 && (
        <section aria-label="Supporting evidence" className="flex flex-col gap-3">
          <h3 className="text-micro font-medium uppercase tracking-caps text-intel">Evidence behind this match</h3>
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
            {supportingEvidence.map((ev) => (
              <EvidenceCard key={ev.id} evidence={ev} compact onInspect={() => onInspectEvidence?.(ev)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
