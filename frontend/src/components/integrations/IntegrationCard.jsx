import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { toast } from "../../store/toastStore";

const statusConfig = {
  connected: { tone: "success", label: "Connected" },
  available: { tone: "info", label: "Available" },
  coming_soon: { tone: "neutral", label: "Coming soon" },
  connected_partial: { tone: "caution", label: "Partial" },
};

/** One evidence-source provider row with connect state. */
export default function IntegrationCard({ name, description, status = "available", note, icon, className = "" }) {
  const cfg = statusConfig[status] || statusConfig.available;
  const isConnected = status === "connected" || status === "connected_partial";

  return (
    <div className={`panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${className}`}>
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-surface-2 text-ink-hi">
        {icon || <PlugGlyph />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-body-sm font-semibold text-ink-hi">{name}</h3>
          <Badge tone={cfg.tone} size="sm" dot>{cfg.label}</Badge>
        </div>
        <p className="mt-1 text-meta leading-snug text-ink-muted">{description}</p>
        {note && <p className="mt-1 text-micro text-caution">{note}</p>}
      </div>
      <div className="shrink-0">
        {status === "coming_soon" ? (
          <Button size="sm" variant="ghost" disabled>Not yet</Button>
        ) : isConnected ? (
          <Button size="sm" variant="secondary" onClick={() => toast.info(`${name} management opens once the integrations service is live.`)}>
            Manage
          </Button>
        ) : (
          <Button size="sm" onClick={() => toast.info(`${name} connect requires the backend ingestion service.`)}>
            Connect
          </Button>
        )}
      </div>
    </div>
  );
}

function PlugGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22v-5" /><path d="M9 8V2" /><path d="M15 8V2" /><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  );
}
