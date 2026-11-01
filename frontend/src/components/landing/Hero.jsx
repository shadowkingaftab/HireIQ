import { Suspense, lazy, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Reveal from "./Reveal";
import ProofGraphVisual from "./ProofGraphVisual";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const EvidenceConstellation = lazy(() => import("./EvidenceConstellation"));

const HEADLINE_PRIMARY = ["Don't", "just", "claim", "what", "you", "can", "do."];
const HEADLINE_ACCENT = ["Prove", "it."];

function HeadlineWords() {
  return (
    <>
      <span className="sr-only">Don&apos;t just claim what you can do. Prove it.</span>
      <span aria-hidden="true" className="block">
        {HEADLINE_PRIMARY.map((word) => (
          <span key={word} className="hero-word-mask mr-[0.22em] last:mr-0">
            <span className="hero-word">{word}</span>
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="mt-1 block">
        {HEADLINE_ACCENT.map((word) => (
          <span key={word} className="hero-word-mask mr-[0.22em] last:mr-0">
            <span className="hero-word hero-title-accent">{word}</span>
          </span>
        ))}
      </span>
    </>
  );
}

export default function Hero() {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      gsap.from(".hero-word", {
        yPercent: 118,
        opacity: 0,
        rotate: 2.5,
        duration: 1.15,
        ease: "power4.out",
        stagger: 0.075,
        delay: 0.12,
      });

      gsap.from(".hero-headline-aura", {
        opacity: 0,
        scale: 0.86,
        duration: 1.8,
        ease: "power2.out",
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] }
  );

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative overflow-hidden"
    >
      <div className="constellation-mesh" aria-hidden="true" />

      <Container className="relative z-[1] pt-28 sm:pt-32 lg:pt-36">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <Reveal>
            <Badge
              tone="info"
              dot
              mono
              className="hero-proof-badge mb-7"
            >
              Evidence-first hiring intelligence
            </Badge>
          </Reveal>

          <div className="relative">
            <div
              className="hero-headline-aura pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[30rem] w-[54rem] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
              style={{
                background:
                  "radial-gradient(ellipse, rgba(14,165,233,0.18) 0%, rgba(14,165,233,0.07) 38%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            <h1
              id="hero-title"
              className="hero-title text-[3.15rem] text-stellar sm:text-[5.25rem] lg:text-[7rem]"
            >
              <HeadlineWords />
            </h1>
          </div>

          <Reveal delay={160}>
            <p className="mx-auto mt-7 max-w-2xl text-body-lg leading-relaxed text-nebula">
              ProofHire turns verified work — repositories, assessments, real contributions —
              into explainable capability signals. Recruiters see demonstrated skill, and every
              score traces back to its evidence.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
              <Button
                size="lg"
                to="/signup"
                className="hero-cta w-full rounded-full border-0 px-7 font-semibold sm:w-auto"
              >
                Build your proof
              </Button>
              <Button
                size="lg"
                variant="outline"
                href="#how-it-works"
                className="hero-secondary w-full rounded-full px-7 sm:w-auto"
              >
                Explore how it works
              </Button>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-7 flex flex-wrap items-center justify-center gap-2 font-mono text-micro uppercase tracking-caps text-nebula/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-soft" aria-hidden="true" />
              Candidate-controlled evidence · Explainable scores · No black-box ranking
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero-stage relative mx-auto mt-10 max-w-6xl sm:mt-12">
          <div className="hero-stage-orbit" aria-hidden="true" />

          <div className="relative overflow-hidden rounded-[1.75rem] border border-electric/[0.15] bg-[rgba(17,24,39,0.3)] shadow-[0_0_90px_rgba(14,165,233,0.08)] backdrop-blur-[2px]">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4">
              <span className="constellation-layer-label flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-soft" aria-hidden="true" />
                EVIDENCE CONSTELLATION
              </span>
              <span className="constellation-layer-label hidden sm:inline">DEMO DATA · TRACEABLE</span>
            </div>

            <div className="h-[350px] w-full sm:h-[470px] lg:h-[560px]">
              <Suspense fallback={<ProofGraphVisual />}>
                <EvidenceConstellation />
              </Suspense>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center px-5 py-4">
              <span className="constellation-layer-label text-center">
                REPOSITORY → VERIFIED SKILL → CAPABILITY → MATCH
              </span>
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-micro tracking-wide text-nebula/60">
            Every signal traces back to its evidence.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
