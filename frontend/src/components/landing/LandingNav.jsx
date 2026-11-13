import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { brand } from "../../utils/brand";
import BrandLogo from "../BrandLogo";

const anchors = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "#pathways", label: "For you" },
];

export default function LandingNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[100] border-b border-electric/10 bg-[#02070A]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none"
          aria-label={`${brand.name} home`}
        >
          <BrandLogo variant="compact" tone="dark" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Page sections">
          {anchors.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="group relative rounded-md px-3 py-2 text-body-sm text-nebula transition-colors hover:text-stellar focus-visible:outline-none"
            >
              {label}
              <span
                aria-hidden="true"
                className="absolute inset-x-3 -bottom-px h-px scale-x-0 bg-gradient-to-r from-transparent via-electric to-transparent transition-transform duration-300 group-hover:scale-x-100"
              />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            size="sm"
            to="/login"
            className="hidden rounded-full text-nebula hover:text-stellar sm:inline-flex"
          >
            Log in
          </Button>
          <Button
            size="sm"
            to="/signup"
            className="hero-cta rounded-full border-0 px-4 font-semibold"
          >
            Build your proof
          </Button>
        </div>
      </div>
    </header>
  );
}
