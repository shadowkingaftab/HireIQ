import ProofGraphVisual from "./ProofGraphVisual";
import Reveal from "./Reveal";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative">
      <Container className="pt-28 sm:pt-32 lg:pt-36">
        <div className="grid grid-cols-1 items-center gap-12 pb-16 lg:grid-cols-12 lg:gap-10 lg:pb-24">
          <div className="lg:col-span-5">
            <Reveal>
              <Badge tone="info" dot className="mb-6">
                Evidence-first hiring intelligence
              </Badge>
            </Reveal>

            <Reveal delay={80}>
              <h1 id="hero-title" className="text-display-lg sm:text-display-xl text-ink-hi">
                Don&apos;t just claim what you can do.
                <span className="mt-1 block bg-gradient-to-r from-intel to-signal bg-clip-text text-transparent">
                  Prove it.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-lg text-body leading-relaxed text-ink-muted">
                ProofHire turns verified work — repositories, assessments, real contributions —
                into explainable capability signals. Recruiters see demonstrated skill, and every
                score traces back to its evidence.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" to="/signup" className="w-full sm:w-auto">
                  Build your proof
                </Button>
                <Button size="lg" variant="outline" href="#how-it-works" className="w-full sm:w-auto">
                  Explore how it works
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <p className="mt-8 flex items-center gap-2 text-micro text-ink-faint">
                <span className="h-1 w-1 rounded-full bg-verified" aria-hidden="true" />
                Candidate-controlled evidence · Explainable scores · No black-box ranking
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={200} className="relative mx-auto max-w-[640px]">
              <ProofGraphVisual />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
