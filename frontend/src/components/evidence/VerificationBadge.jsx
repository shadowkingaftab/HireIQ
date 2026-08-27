import { ShieldCheck, ShieldQuestion, ShieldAlert } from "lucide-react";
import Tooltip from "../ui/Tooltip";

/**
 * Verification state of an evidence artifact.
 * verified → third-party attested · unverified → claim only.
 */
export default function VerificationBadge({ evidence, size = "sm", withLabel = false, className = "" }) {
  const state = !evidence?.verification
    ? "unverified"
    : evidence.verified
      ? "verified"
      : "pending";

  const config = {
    verified: {
      icon: ShieldCheck,
      label: "Verified",
      cls: "border-verified/30 bg-verified-soft text-verified",
      tip: `Verified · ${evidence?.verification?.method || "third-party check"}${
        evidence?.verification?.checkedAt ? ` · ${new Date(evidence.verification.checkedAt).toLocaleDateString()}` : ""
      }`,
    },
    pending: {
      icon: ShieldQuestion,
      label: "Verification pending",
      cls: "border-caution/30 bg-caution-soft text-caution",
      tip: "Verification in progress",
    },
    unverified: {
      icon: ShieldAlert,
      label: "Unverified claim",
      cls: "border-line-strong bg-surface-2 text-ink-muted",
      tip: "Self-reported — no independent verification yet",
    },
  }[state];

  const Icon = config.icon;
  return (
    <Tooltip content={config.tip}>
      <span
        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 font-medium ${config.cls} ${
          size === "sm" ? "text-micro" : "text-meta"
        } ${className}`}
      >
        <Icon size={size === "sm" ? 11 : 13} aria-hidden="true" />
        {withLabel && config.label}
        {!withLabel && <span className="sr-only">{config.label}</span>}
      </span>
    </Tooltip>
  );
}
