import { ScoreRing } from "../ui/Progress";
import { ConfidenceBar } from "../ui/Progress";

/**
 * Inline match score with confidence — used in ranked rows and headers.
 * Score is mono; uncertainty is never omitted.
 */
export default function MatchScore({ match, size = 56, showConfidence = true, className = "" }) {
  const tone = match.score >= 80 ? "verified" : match.score >= 60 ? "intel" : "caution";
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ScoreRing value={match.score} size={size} tone={tone} label="match" />
      {showConfidence && (
        <div className="min-w-24">
          <ConfidenceBar
            value={100 - Math.min(50, match.uncertainty)}
            uncertainty={match.uncertainty}
            aria-label="Match confidence"
          />
          <p className="mt-1 text-micro text-ink-faint">
            {match.rank != null && <>rank #{match.rank} · </>}
            ±{match.uncertainty}% uncertainty
          </p>
        </div>
      )}
    </div>
  );
}
