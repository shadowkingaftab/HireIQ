import Button from "../ui/Button";
import TrustStrip from "./TrustStrip";
import OrioGreeting from "./OrioGreeting";

function HeroContent() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-[clamp(4.25rem,8vh,5.5rem)] text-center">
      <h1
        id="hero-title"
        className="font-serif text-6xl leading-[0.95] tracking-tighter text-white sm:text-7xl md:text-8xl"
        style={{ textShadow: "0 2px 24px rgba(2,7,10,0.85), 0 0 40px rgba(2,7,10,0.5)" }}
      >
        Don&apos;t just claim,
        <br />

        <span className="mt-2 inline-block italic text-[#FF9A1F] [text-shadow:0_0_22px_rgba(255,154,31,0.28)]">
          Prove it.
        </span>
      </h1>

      <p
        className="mt-6 w-full max-w-[640px] text-base font-medium leading-relaxed text-[#E6F4FF] sm:text-lg"
        style={{ textShadow: "0 1px 12px rgba(2,7,10,0.9)" }}
      >
        ORIONET turns verified work into explainable capability signals.
        Recruiters see demonstrated skill, and every score traces back to its
        evidence.
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   THREE-COLUMN STATS & CTA
------------------------------------------------------- */

function HeroStats() {
  return (
    <div className="relative z-10 mx-auto mt-4 grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-6 sm:mt-5 sm:gap-6">
      {/* LEFT STAT */}

      <div className="flex min-w-0 flex-col items-end text-right">
        <span className="font-serif text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,.55)] sm:text-5xl">
          100%
        </span>

        <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,.7)] sm:text-xs sm:tracking-wider">
          Evidence Backed
        </span>
      </div>

      {/* CENTER CTA */}

      <div className="flex justify-center">
        <Button
          to="/signup"
          className="orion-orange-cta whitespace-nowrap rounded-full border-0 px-5 py-3 text-xs font-bold text-white sm:px-8 sm:text-sm"
        >
          Build your proof
        </Button>
      </div>

      {/* RIGHT STAT */}

      <div className="flex min-w-0 flex-col items-start text-left">
        <span className="font-serif text-4xl font-bold tracking-tight text-white [text-shadow:0_2px_14px_rgba(0,0,0,.55)] sm:text-5xl">
          94
        </span>

        <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white [text-shadow:0_1px_8px_rgba(0,0,0,.7)] sm:text-xs sm:tracking-wider">
          Matches
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN HERO COMPONENT
------------------------------------------------------- */

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col items-center overflow-hidden bg-transparent text-white md:min-h-[100svh]"
    >
      {/* MAIN CONTENT */}

      <HeroContent />

      <OrioGreeting />

      {/* STATS AND BUTTON */}

      <HeroStats />

      <div className="relative z-10 mt-auto w-full pb-7 pt-4 sm:pb-8">
        <TrustStrip />
      </div>
    </section>
  );
}


