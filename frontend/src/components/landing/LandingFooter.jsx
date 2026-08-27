import { Link } from "react-router-dom";
import { brand } from "../../utils/brand";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pathways", label: "For you" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-line-subtle">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-intel/30 bg-intel-soft font-mono text-[10px] font-bold text-intel">{brand.shortMark}
          </span>
          <div>
            <p className="text-body-sm font-semibold text-ink-hi">{brand.name}</p>
            <p className="text-micro text-ink-faint">Evidence-first hiring intelligence</p>
          </div>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {links.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded text-meta font-sans text-ink-muted transition-colors hover:text-ink-hi focus-visible:outline-none"
            >
              {label}
            </a>
          ))}
          <Link
            to="/login"
            className="rounded text-meta font-sans text-ink-muted transition-colors hover:text-ink-hi focus-visible:outline-none"
          >
            Log in
          </Link>
        </nav>

        <p className="text-micro text-ink-faint">© {new Date().getFullYear()} {brand.name}</p>
      </div>
    </footer>
  );
}

