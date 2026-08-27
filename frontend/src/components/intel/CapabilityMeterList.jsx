import { ConfidenceBar, ScoreRing } from "../ui/Progress";
import Tooltip from "../ui/Tooltip";
import { Info } from "lucide-react";

/**
 * Capability rows: score, uncertainty band, evidence count, and provenance
 * hint. The canonical way ProofHire lists what someone can do — never a bare
 * tag cloud.
 */
function CapabilityRow({ capability, onInspect }) {
  const strength =
    capability.score >= 75 ? "strong" : capability.score >= 55 ? "moderate" : "weak";
  const strengthLabel = {
    strong: "Strong evidence",
    moderate: "Moderate evidence",
    weak: "Thin evidence",
  }[strength];

  return (
    <li className="group grid grid-cols-[minmax(9rem,14rem)_1fr_auto] items-center gap-x-4 gap-y-1 rounded-lg px-3 py-3 transition-colors hover:bg-surface-2/60 sm:gap-x-6">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onInspect?.(capability)}
            className="truncate rounded text-left text-body-sm font-medium text-ink-hi transition-colors hover:text-intel focus-visible:outline-none"
          >
            {capability.name}
          </button>
          <Tooltip content={`${strengthLabel} · ${capability.evidenceCount} linked item${capability.evidenceCount === 1 ? "" : "s"}`}>
            <button
              type="button"
              className="rounded p-0.5 text-ink-faint opacity-0 transition-opacity hover:text-intel focus-visible:opacity-100 focus-visible:outline-none group-hover:opacity-100"
              aria-label={`About ${capability.name}: ${strengthLabel}, ${capability.evidenceCount} linked evidence items`}
            >
              <Info size={12} aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
        <span className="numeric mt-0.5 block text-micro text-ink-faint">
          {capability.evidenceCount} evidence · {strengthLabel.toLowerCase()}
        </span>
      </div>

      <ConfidenceBar
        value={capability.score}
        uncertainty={capability.uncertainty}
        className="min-w-0"
        aria-label={`${capability.name} confidence`}
      />

      <ScoreRing value={capability.score} size={44} tone={strength === "weak" ? "caution" : "intel"} />
    </li>
  );
}

/**
 * @param capabilities [{name, score, uncertainty, evidenceCount}]
 * @param onInspect (capability) => void — wire to graph/drawer inspection
 */
export default function CapabilityMeterList({ capabilities = [], onInspect, className = "" }) {
  if (!capabilities.length) return null;
  const sorted = [...capabilities].sort((a, b) => b.score - a.score);
  return (
    <ul role="list" className={`flex flex-col divide-y divide-line-subtle/60 ${className}`}>
      {sorted.map((cap) => (
        <CapabilityRow key={cap.name} capability={cap} onInspect={onInspect} />
      ))}
    </ul>
  );
}
