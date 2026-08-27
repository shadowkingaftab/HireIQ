import { formatDate } from "../../utils/formatters";

const steps = [
  { key: "source", label: "Source captured", detail: (ev) => ev.source },
  {
    key: "identity",
    label: "Identity attribution",
    detail: (ev) => ev.external_id || "No external identifier",
  },
  {
    key: "verification",
    label: "Independent verification",
    detail: (ev) =>
      ev.verification
        ? `${ev.verification.method}${ev.verification.checkedAt ? ` · ${formatDate(ev.verification.checkedAt)}` : ""}`
        : "Not performed — treated as claim only",
    failed: (ev) => !ev.verification,
  },
];

/**
 * The provenance chain of an evidence artifact: where it came from, how it
 * was attributed, and whether anyone independent confirmed it.
 */
export default function ProvenanceTrail({ evidence }) {
  return (
    <ol role="list" className="relative flex flex-col gap-4 pl-1">
      {steps.map((step, i) => {
        const failed = step.failed?.(evidence);
        return (
          <li key={step.key} className="relative flex gap-3 pl-6">
            {/* connector */}
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-[7px] top-5 h-[calc(100%+8px)] w-px bg-line-subtle" />
            )}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                failed ? "border-caution/60 bg-canvas" : "border-verified/60 bg-verified/25"
              }`}
            />
            <div className="min-w-0">
              <p className="text-body-sm font-medium text-ink-hi">{step.label}</p>
              <p className={`mt-0.5 text-meta leading-snug ${failed ? "text-caution" : "text-ink-muted"}`}>
                {step.detail(evidence)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
