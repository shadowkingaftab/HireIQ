import { ExternalLink } from "lucide-react";
import VerificationBadge from "../evidence/VerificationBadge";
import EvidenceSourceBadge from "../evidence/EvidenceSourceBadge";

/**
 * Repository evidence rendered as explorable projects — the tangible work
 * behind capability claims.
 */
export default function ProjectExplorer({ evidence = [], onInspect, className = "" }) {
  return (
    <section aria-label="Projects" className={`panel p-5 ${className}`}>
      <h3 className="text-micro font-medium uppercase tracking-caps text-intel">Projects &amp; repositories</h3>
      {!evidence.length ? (
        <p className="mt-4 text-body-sm text-ink-muted">No public project evidence connected yet.</p>
      ) : (
        <ul role="list" className="mt-4 flex flex-col divide-y divide-line-subtle/60">
          {evidence.map((ev) => (
            <li key={ev.id} className="flex items-start justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => onInspect?.(ev)}
                className="min-w-0 flex-1 rounded text-left focus-visible:outline-none"
              >
                <p className="truncate text-body-sm font-medium text-ink-hi hover:text-intel">{ev.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <EvidenceSourceBadge source={ev.source} />
                  <span className="numeric font-mono text-micro text-ink-faint">
                    {ev.metrics?.stars != null && `★ ${ev.metrics.stars.toLocaleString()}`}
                    {ev.metrics?.commits_90d != null && ` · ${ev.metrics.commits_90d} commits/90d`}
                    {ev.metrics?.prs_merged != null && ` · ${ev.metrics.prs_merged} PRs merged`}
                  </span>
                </div>
              </button>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <VerificationBadge evidence={ev} />
                {ev.url && (
                  <a
                    href={ev.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded p-1 text-ink-faint transition-colors hover:text-intel focus-visible:outline-none"
                    aria-label={`Open ${ev.title} in a new tab`}
                  >
                    <ExternalLink size={13} aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
