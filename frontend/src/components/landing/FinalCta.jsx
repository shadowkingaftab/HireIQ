import Reveal from "./Reveal";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { brand } from "../../utils/brand";

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title">
      <Container size="md">
        <Reveal>
          <div className="constellation-card relative overflow-hidden rounded-[1.75rem] px-6 py-16 text-center sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(34rem 20rem at 50% -18%, rgba(14,165,233,0.16), transparent 65%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border border-electric/10"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full border border-electric/10"
            />

            <p className="relative font-mono text-micro uppercase tracking-caps text-electric-soft">
              {brand.name}
            </p>
            <h2
              id="final-cta-title"
              className="relative mt-4 font-display text-[2.75rem] leading-[1.02] tracking-tight text-stellar sm:text-[4rem]"
            >
              Capability is more than a résumé.
            </h2>
            <p className="relative mt-4 text-body-lg leading-relaxed text-nebula">
              Show the proof.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                to="/signup"
                className="hero-cta w-full rounded-full border-0 px-7 font-semibold sm:w-auto"
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="#how-it-works"
                className="hero-secondary w-full rounded-full px-7 sm:w-auto"
              >
                See how it works
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
