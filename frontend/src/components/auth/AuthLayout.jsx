import { Link } from "react-router-dom";
import { ShieldCheck, ScanSearch, Lock } from "lucide-react";
import Container from "../ui/Container";
import { brand } from "../../utils/brand";
import BrandLogo from "../BrandLogo";
import OrioGreeting from "../landing/OrioGreeting";

const proofPoints = [
  { icon: ShieldCheck, label: "Evidence-backed signals" },
  { icon: ScanSearch, label: "Explainable, traceable scores" },
  { icon: Lock, label: "Candidate-controlled privacy" },
];

/**
 * Shared authentication layout — calm "secure intelligence workspace".
 * Desktop: brand/message left, focused form card right.
 * Mobile: compact brand row, form immediately accessible.
 */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth-layout flex min-h-dvh bg-transparent">
      {/* Brand / message column */}
      <aside className="relative hidden w-[44%] max-w-xl flex-col justify-between border-r border-white/10 bg-[#040918]/80 p-10 lg:flex xl:p-14">
        <Link to="/" className="w-fit rounded-md focus-visible:outline-none" aria-label={`${brand.name} home`}>
          <BrandLogo variant="compact" tone="dark" />
        </Link>

        <div>
          <p className="text-micro font-bold uppercase tracking-caps text-[#62D2FF]">{brand.tagline}</p>
          <h2 className="mt-3 text-page font-bold text-white [text-shadow:0_2px_16px_rgba(0,0,0,.7)]">{brand.statement}</h2>

          <div className="mt-8">
            <OrioGreeting />
          </div>

          <ul className="mt-10 flex flex-col gap-3">
            {proofPoints.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-body-sm font-semibold text-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/20 bg-white/5 text-[#45C8FF]">
                  <Icon size={13} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-micro font-medium text-white/80">
          Protected workspace · Sessions are encrypted in transit
        </p>
      </aside>

      {/* Form column */}
      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-5 lg:hidden">
          <Link to="/" className="rounded-md focus-visible:outline-none" aria-label={`${brand.name} home`}>
            <BrandLogo variant="compact" tone="dark" />
          </Link>
        </div>

        <Container size="sm" className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <div className="w-full max-w-md animate-fade-up rounded-3xl border border-white/20 bg-[#030716]/90 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
            <h1 className="text-page font-bold text-white [text-shadow:0_1px_12px_rgba(0,0,0,.55)]">{title}</h1>
            {subtitle && <p className="mt-1.5 text-body-sm font-medium text-white">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </Container>
      </main>
    </div>
  );
}
