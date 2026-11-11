import { Link } from "react-router-dom";
import { ShieldCheck, ScanSearch, Lock } from "lucide-react";
import Container from "../ui/Container";
import { brand } from "../../utils/brand";

const proofPoints = [
  { icon: ShieldCheck, label: "Evidence-backed signals" },
  { icon: ScanSearch, label: "Explainable, traceable scores" },
  { icon: Lock, label: "Candidate-controlled privacy" },
];

/** Quiet abstract node motif — echoes the landing intelligence visual. */
function EvidenceMotif() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 200"
      className="mt-12 w-full max-w-sm opacity-70"
    >
      <g stroke="hsl(var(--ph-line-strong) / 0.5)" strokeWidth="1">
        <line x1="40" y1="40" x2="140" y2="100" />
        <line x1="40" y1="160" x2="140" y2="100" />
        <line x1="140" y1="100" x2="240" y2="60" />
        <line x1="140" y1="100" x2="240" y2="150" />
      </g>
      <line x1="40" y1="160" x2="240" y2="150" className="ph-edge-flow" stroke="hsl(var(--ph-verified) / 0.55)" strokeWidth="1.4" />
      <rect x="30" y="30" width="20" height="20" rx="6" fill="hsl(var(--ph-surface-3))" stroke="hsl(var(--ph-line-strong))" />
      <circle cx="140" cy="100" r="14" fill="hsl(var(--ph-intel-soft))" stroke="hsl(var(--ph-intel) / 0.5)" />
      <rect x="230" y="140" width="20" height="20" rx="6" fill="hsl(var(--ph-verified-soft))" stroke="hsl(var(--ph-verified) / 0.5)" />
      <text x="262" y="64" fontSize="9" fill="hsl(var(--ph-ink-faint))">capability</text>
    </svg>
  );
}

/**
 * Shared authentication layout — calm "secure intelligence workspace".
 * Desktop: brand/message left, focused form card right.
 * Mobile: compact brand row, form immediately accessible.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-dvh bg-transparent">
      {/* Brand / message column */}
      <aside className="relative hidden w-[44%] max-w-xl flex-col justify-between border-r border-line-subtle bg-surface-1/50 p-10 lg:flex xl:p-14">
        <Link to="/" className="w-fit rounded-md focus-visible:outline-none" aria-label={`${brand.name} home`}>
          <span className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-intel/30 bg-intel-soft font-mono text-[11px] font-bold tracking-tight text-intel"
            >
              {brand.shortMark}
            </span>
            <span className="text-body-sm font-semibold tracking-tight text-ink-hi">{brand.name}</span>
          </span>
        </Link>

        <div>
          <p className="text-micro font-medium uppercase tracking-caps text-intel">{brand.tagline}</p>
          <h2 className="mt-3 text-page text-ink-hi">{brand.statement}</h2>

          <EvidenceMotif />

          <ul className="mt-10 flex flex-col gap-3">
            {proofPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-body-sm text-ink-muted">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-line-subtle bg-surface-1 text-intel">
                  <Icon size={13} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-micro text-ink-faint">
          Protected workspace · Sessions are encrypted in transit
        </p>
      </aside>

      {/* Form column */}
      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <Link to="/" className="rounded-md focus-visible:outline-none" aria-label={`${brand.name} home`}>
            <span className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-intel/30 bg-intel-soft font-mono text-[10px] font-bold text-intel"
              >
                {brand.shortMark}
              </span>
              <span className="text-body-sm font-semibold text-ink-hi">{brand.name}</span>
            </span>
          </Link>
        </div>

        <Container size="sm" className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md animate-fade-up">
            <h1 className="text-page text-ink-hi">{title}</h1>
            {subtitle && <p className="mt-1.5 text-body-sm text-ink-muted">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </Container>
      </main>
    </div>
  );
}
