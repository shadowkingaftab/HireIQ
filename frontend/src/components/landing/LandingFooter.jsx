import { Link } from "react-router-dom";
import { brand } from "../../utils/brand";
import BrandLogo from "../BrandLogo";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pathways", label: "For you" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-electric/10 bg-[#030712]/50 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-7 px-4 py-8 sm:flex-row sm:gap-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <BrandLogo variant="compact" tone="dark" />
          <p className="font-mono text-micro tracking-wide text-nebula/70">
            Evidence-first hiring intelligence
          </p>
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
