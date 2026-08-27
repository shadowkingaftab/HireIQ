import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { brand } from "../../utils/brand";

const anchors = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pathways", label: "For you" },
];

export default function LandingNav() {
  return (
    <header className="panel-glass fixed inset-x-0 top-0 z-sticky border-b">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none" aria-label={`${brand.name} home`}>
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-intel/30 bg-intel-soft font-mono text-[11px] font-bold tracking-tight text-intel">{brand.shortMark}
          </span>
          <span className="text-body-sm font-semibold tracking-tight text-ink-hi">{brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Page sections">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="rounded-md px-3 py-2 text-body-sm text-ink-muted transition-colors hover:bg-surface-2/70 hover:text-ink-hi focus-visible:outline-none"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button variant="ghost" size="sm" to="/login" className="hidden sm:inline-flex">
            Log in
          </Button>
          <Button size="sm" to="/signup">
            Build your proof
          </Button>
        </div>
      </div>
    </header>
  );
}

