import Reveal from "./Reveal";
import Container from "../ui/Container";
import Button from "../ui/Button";
import { brand } from "../../utils/brand";

export default function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title">
      <Container size="md">
        <Reveal>
          <div className="edge-highlight relative overflow-hidden rounded-card border border-line-subtle bg-surface-1 px-6 py-16 text-center shadow-raised sm:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(30rem 18rem at 50% -20%, hsl(var(--ph-intel) / 0.09), transparent 65%)",
              }}
            />
            <p className="relative text-micro font-medium uppercase tracking-caps text-intel">
              {brand.name}
            </p>
            <h2 id="final-cta-title" className="relative mt-3 text-display-lg text-ink-hi">
              Capability is more than a résumé.
            </h2>
            <p className="relative mt-4 text-body-lg leading-relaxed text-ink-muted">
              Show the proof.
            </p>
            <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" to="/signup" className="w-full sm:w-auto">
                Get started
              </Button>
              <Button size="lg" variant="outline" href="#how-it-works" className="w-full sm:w-auto">
                See how it works
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
