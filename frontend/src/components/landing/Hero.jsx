import Button from "../ui/Button";

/* -------------------------------------------------------
   PANEL CONFIGURATION
------------------------------------------------------- */

const panelClass =
  "relative flex flex-col justify-between overflow-hidden rounded-t-2xl border border-white/10 border-b-0 border-t-white/20 bg-[#06111B]/80 p-6 backdrop-blur-xl shadow-2xl";

/* -------------------------------------------------------
   KEYFRAMES (opacity only, so inline transforms are kept)
------------------------------------------------------- */

function HeroKeyframes() {
  return (
    <style>{`
      @keyframes ph-breathe {
        0%, 100% { opacity: 0.85; }
        50% { opacity: 1; }
      }
      @keyframes ph-flicker {
        0%, 100% { opacity: 0.75; }
        50% { opacity: 1; }
      }
      .ph-breathe { animation: ph-breathe 5s ease-in-out infinite; }
      .ph-flicker { animation: ph-flicker 3.5s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .ph-breathe, .ph-flicker { animation: none; }
      }
    `}</style>
  );
}

/* -------------------------------------------------------
   BACKGROUND ENVIRONMENT
------------------------------------------------------- */

function FlameEnvironment() {
  // Fades the line texture out toward the top and sides
  const lineMask =
    "radial-gradient(ellipse 75% 85% at 50% 100%, black 15%, rgba(0,0,0,0.6) 45%, transparent 80%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* 1. NAVY SKY: smooth deep blue to black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0C2A56 0%, #0A2048 25%, #061330 50%, #02070A 85%)",
        }}
      />

      {/* 2. WIDE ELECTRIC BLUE GLOW */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 50% 100%, rgba(2,151,222,0.6) 0%, rgba(2,151,222,0.28) 40%, rgba(2,151,222,0.08) 65%, transparent 82%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 3. ORANGE ARCH: wide, spreads past the side panels */}
      <div
        className="ph-breathe absolute bottom-0 left-1/2 h-[80%] w-[130%] max-w-[1800px]"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse 50% 100% at 50% 100%, #FFB59A 0%, #FC734D 18%, rgba(252,115,77,0.7) 38%, rgba(252,115,77,0.25) 60%, transparent 80%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 4. HOT CORE: pale peach at the base */}
      <div
        className="ph-flicker absolute bottom-0 left-1/2 h-[35%] w-[55%] max-w-[800px]"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(255,243,235,1) 0%, rgba(255,205,180,0.75) 30%, transparent 75%)",
          mixBlendMode: "screen",
        }}
      />

      {/* 5. VERTICAL LINE TEXTURE: blue, full width */}
      <div
        className="absolute inset-x-0 bottom-0 h-[85%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(66,201,255,0.55) 0px, rgba(66,201,255,0.55) 1px, transparent 1px, transparent 9px)",
          maskImage: lineMask,
          WebkitMaskImage: lineMask,
          mixBlendMode: "screen",
          opacity: 0.55,
        }}
      />

      {/* 6. VERTICAL LINE TEXTURE: warm, concentrated near the flame */}
      <div
        className="ph-flicker absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,190,160,0.6) 0px, rgba(255,190,160,0.6) 1px, transparent 1px, transparent 9px)",
          maskImage:
            "radial-gradient(ellipse 45% 90% at 50% 100%, black 10%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 45% 90% at 50% 100%, black 10%, transparent 75%)",
          mixBlendMode: "screen",
          opacity: 0.5,
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------
   HERO TEXT
------------------------------------------------------- */

function HeroContent() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-40 text-center">
      <h1 className="font-serif text-6xl leading-[0.95] tracking-tighter text-white sm:text-7xl md:text-8xl">
        Don&apos;t just claim,
        <br />

        <span className="mt-2 inline-block italic text-[#0297DE] drop-shadow-[0_0_30px_rgba(2,151,222,0.6)]">
          Prove it.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
        ProofHire turns verified work into explainable capability signals.
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
    <div className="relative z-10 mx-auto mt-12 grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-6 sm:gap-6">
      {/* LEFT STAT */}

      <div className="flex min-w-0 flex-col items-end text-right">
        <span className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
          100%
        </span>

        <span className="mt-2 text-[8px] uppercase tracking-[0.15em] text-gray-500 sm:text-[10px] sm:tracking-widest">
          Evidence Backed
        </span>
      </div>

      {/* CENTER CTA */}

      <div className="flex justify-center">
        <Button
          to="/signup"
          className="whitespace-nowrap rounded-full border-0 bg-[#0297DE] px-4 py-3 text-xs font-semibold text-white shadow-[0_0_40px_rgba(2,151,222,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(2,151,222,0.8)] sm:px-8 sm:text-sm"
        >
          Build your proof
        </Button>
      </div>

      {/* RIGHT STAT */}

      <div className="flex min-w-0 flex-col items-start text-left">
        <span className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
          94
        </span>

        <span className="mt-2 text-[8px] uppercase tracking-[0.15em] text-gray-500 sm:text-[10px] sm:tracking-widest">
          Match Score
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   REPOSITORY PANEL
------------------------------------------------------- */

function RepositoryPanel() {
  return (
    <div className={`${panelClass} h-[240px]`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Repository
        </p>

        <p className="mt-2 text-sm font-medium text-gray-200">
          Verified contribution
        </p>
      </div>

      <div className="relative rounded-xl border border-white/10 bg-[#02070A]/80 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_14px_rgba(2,151,222,0.9)]" />

          <span className="h-1.5 w-24 rounded-full bg-white/20" />
        </div>

        <div className="space-y-3">
          <span className="block h-1.5 w-full rounded-full bg-white/10" />
          <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
          <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PROOF CORE PANEL
------------------------------------------------------- */

function ProofCorePanel() {
  return (
    <div
      className={`${panelClass} z-10 h-[280px] items-center border-[#0297DE]/40 bg-[#06111B]/90 text-center shadow-[0_-20px_80px_rgba(252,115,77,0.2)]`}
    >
      <p className="self-start font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
        Proof Core
      </p>

      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#0297DE]/40 bg-[radial-gradient(circle,rgba(2,151,222,0.18),transparent_70%)] shadow-[0_0_50px_rgba(2,151,222,0.25)]">
        <div className="absolute inset-2 rounded-full border border-[#0297DE]/30" />

        <div className="absolute inset-5 rounded-full border border-dashed border-[#0297DE]/40" />

        <div className="h-10 w-10 rounded-full bg-[#0297DE] shadow-[0_0_35px_#0297DE,0_0_60px_rgba(2,151,222,0.5)]" />
      </div>

      <p className="text-xs text-gray-300">
        Evidence connected to skill
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   CAPABILITY SIGNAL PANEL
------------------------------------------------------- */

function CapabilityPanel() {
  return (
    <div className={`${panelClass} h-[240px]`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Capability Signal
        </p>

        <p className="mt-2 text-sm font-medium text-gray-200">
          Match score
        </p>
      </div>

      <div className="space-y-5 rounded-xl border border-white/10 bg-[#02070A]/80 p-5">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_14px_rgba(252,115,77,0.9)]" />

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#0297DE] to-[#42C9FF]" />
          </div>
        </div>

        <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />

        <span className="block h-1.5 w-5/6 rounded-full bg-white/10" />
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
      className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#02070A] text-white"
    >
      <HeroKeyframes />

      {/* BACKGROUND */}

      <FlameEnvironment />

      {/* MAIN CONTENT */}

      <HeroContent />

      {/* STATS AND BUTTON */}

      <HeroStats />

      {/* BOTTOM SHELF */}

      <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl px-6 pb-0">
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <RepositoryPanel />

          <ProofCorePanel />

          <CapabilityPanel />
        </div>
      </div>
    </section>
  );
}