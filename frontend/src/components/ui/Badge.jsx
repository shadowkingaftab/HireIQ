const tones = {
  neutral: "border-line-subtle bg-surface-2 text-ink-med",
  info: "border-intel/25 bg-intel-soft text-intel",
  success: "border-verified/25 bg-verified-soft text-verified",
  warning: "border-caution/25 bg-caution-soft text-caution",
  danger: "border-danger/25 bg-danger-soft text-danger",
};

/** Evidence-strength semantics — the core ProofHire badge family. */
const evidenceTones = {
  strong: "success",
  moderate: "warning",
  weak: "neutral",
};

const dotTones = {
  neutral: "bg-ink-faint",
  info: "bg-intel",
  success: "bg-verified",
  warning: "bg-caution",
  danger: "bg-danger",
};

/**
 * Semantic status/evidence badge. `tone` accepts a base tone name or an
 * evidence strength ("strong" | "moderate" | "weak").
 */
export default function Badge({
  tone = "neutral",
  size = "md",
  dot = false,
  mono = false,
  className = "",
  children,
  ...props
}) {
  const resolved = evidenceTones[tone] || tone;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-medium ${
        tones[resolved] || tones.neutral
      } ${
        size === "sm"
          ? "px-2 py-0.5 text-micro"
          : "px-2.5 py-1 text-meta"
      } ${mono ? "font-mono tracking-tight" : ""} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotTones[resolved]}`} aria-hidden="true" />}
      {children}
    </span>
  );
}
