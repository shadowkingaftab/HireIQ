import Drawer from "../ui/Drawer";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import { ScoreRing } from "../ui/Progress";
import ProvenanceTrail from "./ProvenanceTrail";
import VerificationBadge from "./VerificationBadge";
import EvidenceSourceBadge from "./EvidenceSourceBadge";
import { formatDate } from "../../utils/formatters";

/**
 * Full evidence inspection: summary, provenance chain, metrics, linked
 * skills, and the capability signals it feeds.
 */
export default function EvidenceDrawer({ evidence, onClose, capabilities = [] }) {
  const linkedCapabilities =
    evidence?.skills?.length && capabilities.length
      ? capabilities.filter((cap) =>
          evidence.skills.some(
            (s) => cap.name.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cap.name.toLowerCase())
          )
        )
      : [];

  return (
    <Drawer open={!!evidence} onClose={onClose} position="right" width="lg" title="Evidence inspection">
      {evidence && (
        <div className="flex flex-col gap-6 p-6">
          <header className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(evidence.id)}
                className="numeric rounded font-mono text-micro text-ink-faint transition-colors hover:text-ink-med focus-visible:outline-none"
              >
                {evidence.id}
              </button>
              <VerificationBadge evidence={evidence} withLabel />
            </div>
            <h2 className="text-section text-ink-hi">{evidence.title}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <EvidenceSourceBadge source={evidence.source} mono={false} />
              <Badge tone={evidence.strength} size="sm">
                {evidence.strength} evidence
              </Badge>
              <span className="numeric text-micro text-ink-faint">captured {formatDate(evidence.createdAt)}</span>
            </div>
          </header>

          <div className="flex items-center gap-5 rounded-panel border border-line-subtle bg-surface-1/60 p-4">
            <ScoreRing value={evidence.confidence} size={64} label="confidence" tone={evidence.confidence >= 70 ? "intel" : "caution"} />
            <p className="text-body-sm leading-relaxed text-ink-muted">{evidence.summary}</p>
          </div>

          {evidence.metrics && (
            <section aria-label="Signal metrics" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {Object.entries(evidence.metrics).map(([k, v]) => (
                <div key={k} className="rounded-lg border border-line-subtle bg-surface-1/60 px-3 py-2.5">
                  <p className="text-micro uppercase tracking-caps text-ink-faint">{k.replace(/_/g, " ")}</p>
                  <p className="numeric mt-0.5 font-mono text-body-sm font-semibold text-ink-hi">
                    {typeof v === "number" && v > 1000 ? v.toLocaleString() : String(v)}
                  </p>
                </div>
              ))}
            </section>
          )}

          <section aria-label="Provenance">
            <h3 className="mb-3 text-micro font-medium uppercase tracking-caps text-intel">Provenance trail</h3>
            <ProvenanceTrail evidence={evidence} />
          </section>

          {linkedCapabilities.length > 0 && (
            <section aria-label="Capability signals fed by this evidence">
              <h3 className="mb-2.5 text-micro font-medium uppercase tracking-caps text-intel">Feeds capabilities</h3>
              <ul role="list" className="flex flex-wrap gap-2">
                {linkedCapabilities.map((c) => (
                  <li key={c.name}>
                    <Badge tone="info" size="sm" dot>
                      {c.name} · {c.score}
                    </Badge>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {evidence.url && (
            <Button href={evidence.url} variant="secondary" className="w-full" trailingIcon={<ExternalIcon />}>
              Open source artifact
            </Button>
          )}
        </div>
      )}
    </Drawer>
  );
}

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
