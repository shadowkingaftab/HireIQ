import Button from "../ui/Button";

/* -------------------------------------------------------
   FLAME RAY CONFIGURATION
------------------------------------------------------- */

const flameRays = [
  { width: 2, opacity: 0.4, scale: 0.58, delay: "0s" },
  { width: 2, opacity: 0.45, scale: 0.72, delay: "0.6s" },
  { width: 3, opacity: 0.5, scale: 0.88, delay: "1.2s" },
  { width: 4, opacity: 0.6, scale: 0.96, delay: "0.3s" },
  { width: 5, opacity: 0.75, scale: 1, delay: "0.9s" },
  { width: 4, opacity: 0.6, scale: 0.96, delay: "1.5s" },
  { width: 3, opacity: 0.5, scale: 0.88, delay: "0.4s" },
  { width: 2, opacity: 0.45, scale: 0.72, delay: "1.0s" },
  { width: 2, opacity: 0.4, scale: 0.58, delay: "0.7s" },
];

/* -------------------------------------------------------
   PANEL CONFIGURATION
------------------------------------------------------- */

const panelClass =
  "relative flex flex-col justify-between overflow-hidden rounded-t-2xl border border-white/10 border-b-0 border-t-white/20 bg-[#06111B]/80 p-6 backdrop-blur-xl shadow-2xl";

/* -------------------------------------------------------
   KEYFRAMES (scoped to this component)
   Animations only change brightness, so the positioning
   and per-element opacity set inline are never overridden.
------------------------------------------------------- */

function HeroKeyframes() {
  return (
    <style>{`
      @keyframes ph-glow {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.12); }
      }
      @keyframes ph-flicker {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.3); }
      }
      @keyframes ph-sweep {
        0% { transform: translateX(-60%); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateX(60%); opacity: 0; }
      }
      .ph-glow { animation: ph-glow 5s ease-in-out infinite; }
      .ph-flame { animation: ph-flicker 3.2s ease-in-out infinite; }
      .ph-ray { animation: ph-flicker 4s ease-in-out infinite; }
      .ph-sweep { animation: ph-sweep 6s ease-in-out infinite; }
      @media (prefers-reduced-motion: reduce) {
        .ph-glow, .ph-flame, .ph-ray, .ph-sweep { animation: none; }
      }
    `}</style>
  );
}

/* -------------------------------------------------------
   BACKGROUND ENVIRONMENT
------------------------------------------------------- */

function FlameEnvironment() {
  const rayMask = {
    maskImage: "linear-gradient(to top, black 0%, black 35%, transparent 90%)",
    WebkitMaskImage:
      "linear-gradient(to top, black 0%, black 35%, transparent 90%)",
  };

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* NAVY SKY: deep blue fading into black */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0B2A5A 0%, #061632 35%, #02070A 75%)",
          opacity: 0.85,
        }}
      />

      {/* ELECTRIC BLUE HALO across the stage */}
      <div
        className="absolute inset-x-0 bottom-0 h-full"
        style={{
          background:
            "radial-gradient(ellipse 75% 65% at 50% 100%, rgba(2,151,222,0.55) 0%, rgba(2,151,222,0.2) 45%, transparent 75%)",
          mixBlendMode: "screen",
        }}
      />

      {/* LARGE ORANGE GLOW rising from bottom center */}
      <div
        className="ph-glow absolute bottom-[-12%] left-1/2 h-[95%] w-[140vw] max-w-[1600px]"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 100%, #FC734D 0%, rgba(252,115,77,0.65) 28%, rgba(252,115,77,0.22) 55%, transparent 78%)",
          mixBlendMode: "screen",
        }}
      />

      {/* HOT CENTER: pale peach core at the base of the light */}
      <div
        className="ph-flame absolute bottom-0 left-1/2 h-[40%] w-[50vw] max-w-[720px]"
        style={{
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse 50% 60% at 50% 100%, rgba(255,240,228,0.95) 0%, rgba(255,190,160,0.55) 30%, transparent 72%)",
          mixBlendMode: "screen",
        }}
      />

      {/* HORIZON LINE with a light sweep */}
      <div
        className="absolute bottom-0 left-1/2 h-px w-[min(900px,90%)] overflow-hidden"
        style={{
          transform: "translateX(-50%)",
          background:
            "linear-gradient(90deg, transparent, rgba(252,115,77,0.9), rgba(2,151,222,0.9), transparent)",
          boxShadow: "0 0 18px 2px rgba(252,115,77,0.45)",
        }}
      >
        <span className="ph-sweep absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      {/* VERTICAL LIGHT RAYS */}
      <div
        className="absolute bottom-0 left-1/2 flex h-[80%] w-[min(900px,100%)] justify-center gap-5 overflow-hidden"
        style={{ transform: "translateX(-50%)", ...rayMask }}
      >
        {flameRays.map((ray, index) => (
          <div
            key={index}
            className="ph-ray h-full shrink-0"
            style={{
              width: `${ray.width + 1}px`,
              opacity: ray.opacity,
              transform: `scaleY(${ray.scale})`,
              transformOrigin: "bottom center",
              background:
                "linear-gradient(to top, #FC734D 0%, #0297DE 40%, transparent 100%)",
              mixBlendMode: "screen",
              animationDelay: ray.delay,
            }}
          />
        ))}
      </div>
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