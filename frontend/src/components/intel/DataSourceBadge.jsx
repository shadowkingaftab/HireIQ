import { brand } from "../../utils/brand";
import Badge from "../ui/Badge";

/**
 * Provenance marker for data surfaces.
 * "demo" → synthetic demonstration data; "live" → real backend response.
 */
export default function DataSourceBadge({ source, className = "" }) {
  if (source === "live") return null;
  return (
    <Badge
      tone={source === "demo" ? "warning" : "neutral"}
      size="sm"
      dot
      className={`font-sans ${className}`}
      title={
        source === "demo"
          ? `Synthetic demonstration data — no live backend data is available for this surface yet. ${brand.name} never presents fabricated data as real.`
          : "Checking backend…"
      }
    >
      {source === "demo" ? "Demonstration data" : "Loading"}
    </Badge>
  );
}

/** Full-width honest banner for pages rendered from demonstration data. */
export function DemoDataBanner({ note, className = "" }) {
  return (
    <div
      role="note"
      className={`flex items-start gap-2.5 rounded-lg border border-caution/25 bg-caution-soft/40 px-3.5 py-2.5 ${className}`}
    >
      <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />
      <p className="text-meta leading-relaxed text-ink-med">
        <span className="font-medium text-ink-hi">Demonstration data.</span>{" "}
        {note ||
          "This surface is rendered with a coherent synthetic dataset because the backend doesn't serve this data yet. Everything you see exercises the real UI; nothing here represents actual people or outcomes."}
      </p>
    </div>
  );
}
