import { Link } from "react-router-dom";
import { brand } from "../../utils/brand";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pathways", label: "For you" },
];

export default function LandingFooter() {
  return (
    <footer className="orionet-flame-section border-t border-electric/10 bg-[#030712]/50 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-electric/40 bg-electric/10 font-mono text-[10px] font-bold text-electric-soft"
          >
            {brand.shortMark}
          </span>
          <div>
            <p className="text-body-sm font-semibold text-stellar">{brand.name}</p>
            <p className="font-mono text-micro tracking-wide text-nebula/70">
              Evidence-first hiring intelligence
            </p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded text-meta font-sans text-nebula transition-colors hover:text-electric-soft focus-visible:outline-none"
            >
              {label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded text-meta font-sans text-nebula transition-colors hover:text-electric-soft focus-visible:outline-none"
          >
            Log in
          </Link>
        </nav>

        <p className="font-mono text-micro text-nebula/60">
          © {new Date().getFullYear()} {brand.name}
        </p>
      </div>
    </footer>
  );
}
