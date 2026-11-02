import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Reveal from "./Reveal";
import HolographicCore from "./HolographicCore";
import Container from "../ui/Container";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { HeroHighlight, Highlight } from "../ui/hero-highlight";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const HEADLINE_PRIMARY = ["Don't", "just", "claim", "what", "you", "can", "do."];
const SCRAMBLE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789#%*+";

function ScrambledText({ text, reducedMotion }) {
  const [display, setDisplay] = useState(reducedMotion ? text : "#########");

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return undefined;
    }

    let frame = 0;
    const framesToResolve = 24;
    const timer = window.setInterval(() => {
      frame += 1;
      const resolved = Math.floor((frame / framesToResolve) * text.length);
      setDisplay(
        text
          .split("")
          .map((character, index) => {
            if (index < resolved) return character;
            return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          })
          .join("")
      );
      if (frame >= framesToResolve) {
        window.clearInterval(timer);
        setDisplay(text);
      }
    }, 38);

    return () => window.clearInterval(timer);
  }, [reducedMotion, text]);

  return <span aria-hidden="true">{display}</span>;
}

function moveMagneticButton(event, reducedMotion) {
  if (reducedMotion) return;
  const button = event.currentTarget;
  const bounds = button.getBoundingClientRect();
  const x = event.clientX - bounds.left - bounds.width / 2;
  const y = event.clientY - bounds.top - bounds.height / 2;
  button.style.translate = `${x * 0.16}px ${y * 0.2}px`;
}

function HeadlineWords({ reducedMotion }) {
  return (
    <>
      <span className="sr-only">Don&apos;t just claim what you can do. Prove it.</span>
      <span aria-hidden="true" className="block">
        {HEADLINE_PRIMARY.map((word, index) => (
          <motion.span
            key={word}
            className="hero-word mr-[0.22em] last:mr-0"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: index * 0.035 }}
          >
            {word}
          </motion.span>
        ))}
      </span>
      <span aria-hidden="true" className="mt-1 block">
        <motion.span
          className="hero-word inline-block"
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <Highlight className="hero-title-accent rounded-none bg-gradient-to-r from-electric/25 via-electric/10 to-transparent px-0 pb-0 dark:from-electric/25 dark:via-electric/10 dark:to-transparent">
            <ScrambledText text="Prove it." reducedMotion={reducedMotion} />
          </Highlight>
        </motion.span>
      </span>
    </>
  );
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate z-0 overflow-x-clip scroll-mt-24"
    >
      <div className="hero-floor-grid" aria-hidden="true" />

      <Container className="relative z-[1] pt-32">
        <div className="flex w-full flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <Badge
              tone="info"
              dot
              mono
              className="hero-proof-badge mb-7"
            >
              Evidence-first hiring intelligence
            </Badge>
          </Reveal>

          <div className="relative w-full">
            <HeroHighlight
              containerClassName="h-auto w-full items-center justify-center bg-transparent dark:bg-transparent"
              className="w-full"
            >
              <h1
                id="hero-title"
                className="hero-title mx-auto max-w-5xl text-center text-5xl text-stellar sm:text-6xl md:text-8xl"
              >
                <HeadlineWords reducedMotion={reducedMotion} />
              </h1>
            </HeroHighlight>
          </div>

          <p className="mt-7 max-w-2xl text-center text-body-lg leading-relaxed text-nebula">
            Turn demonstrated skills into trusted hiring decisions.
          </p>

          <div className="mt-10 grid w-full max-w-6xl grid-cols-1 items-stretch gap-4 md:grid-cols-2 md:gap-8">
            <Reveal delay={160} className="h-full">
              <div className="hero-glass-panel h-full rounded-2xl p-6 text-left sm:p-7">
                <p className="text-body-lg leading-relaxed text-slate-100">
                  ProofHire turns verified work — repositories, assessments, real contributions —
                  into explainable capability signals. Every score traces back to its evidence.
                </p>
                <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                  <span className="font-mono text-micro uppercase tracking-caps text-nebula">Evidence sources</span>
                  <span className="font-mono text-sm font-semibold text-electric-soft">3 signal types</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={240} className="h-full">
              <div className="hero-glass-panel flex h-full flex-col justify-center gap-3 rounded-2xl p-6 sm:p-7">
                <div
                  onPointerMove={(event) => moveMagneticButton(event, reducedMotion)}
                  onPointerLeave={(event) => {
                    event.currentTarget.style.translate = "0 0";
                  }}
                  className="transition-[translate] duration-200 ease-out"
                >
                  <Button
                    size="lg"
                    to="/signup"
                    className="hero-cta w-full rounded-full border-0 px-7 font-semibold"
                  >
                    Build your proof
                  </Button>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  href="#how-it-works"
                  className="hero-secondary w-full rounded-full px-7"
                >
                  Explore how it works
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={320}>
            <p className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-micro uppercase tracking-caps text-nebula/80">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-electric-soft" aria-hidden="true" />
              Candidate-controlled evidence · Explainable scores · No black-box ranking
            </p>
          </Reveal>
        </div>

        <Reveal delay={200} className="hero-stage relative mx-auto mt-12 max-w-6xl sm:mt-16">
          <div className="hero-stage-orbit" aria-hidden="true" />
          <HolographicCore />
          <p className="mt-4 text-center font-mono text-micro tracking-wide text-nebula/60">
            Every signal traces back to its evidence.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
