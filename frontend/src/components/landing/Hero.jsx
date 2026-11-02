import Button from "../ui/Button";

const panelClass =
  "rounded-t-xl border border-white/10 bg-[#02070A]/80 p-3 backdrop-blur-xl sm:p-4";

function Stat({ value, label, align }) {
  return (
    <div className={`relative z-10 ${align === "right" ? "text-right" : "text-left"}`}>
      <p className="font-['Instrument_Serif'] text-3xl leading-none text-white sm:text-4xl">{value}</p>
      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] text-gray-400 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate min-h-[100svh] overflow-hidden bg-[#02070A] pt-32 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 z-[-1] h-[60vh] w-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(252, 115, 77, 0.8) 0%, rgba(2, 151, 222, 0.4) 30%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[48vh]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, transparent 72%)",
          maskImage: "radial-gradient(ellipse at 50% 100%, black 0%, transparent 72%)",
          transform: "perspective(500px) rotateX(58deg) scale(1.6)",
          transformOrigin: "center bottom",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 px-4 text-center sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-5xl">
          <h1
            id="hero-title"
            className="font-['Instrument_Serif'] text-5xl leading-[0.98] tracking-tight text-white [text-shadow:0_0_28px_rgba(255,255,255,0.18)] sm:text-6xl md:text-7xl"
          >
            <span className="block">Don&apos;t just claim,</span>
            <span className="mt-1 block italic" style={{ color: "#0297DE" }}>
              Prove it.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-gray-400 sm:text-base">
            ProofHire turns verified work into explainable capability signals. Recruiters see
            demonstrated skill, and every score traces back to its evidence.
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-[1fr_0.65fr_1fr] items-center gap-3 sm:gap-8">
            <Stat value="100%" label="Evidence Backed" align="right" />
            <div className="h-px w-full border-t border-white/20 shadow-[0_0_10px_rgba(2,151,222,0.6)]" />
            <Stat value="94" label="Match Score" align="left" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto grid w-full max-w-6xl grid-cols-3 items-end gap-2 px-3 sm:gap-4 sm:px-6 lg:px-8">
        <div className={`${panelClass} min-h-36`}>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 sm:text-xs">
            Repository
          </p>
          <div className="mt-3 rounded-lg border border-white/10 bg-black/40 p-2.5 sm:mt-4 sm:p-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_12px_#0297DE]" />
              <span className="h-1.5 w-2/3 rounded-full bg-white/35" />
            </div>
            <div className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2">
              <span className="block h-1 w-full rounded-full bg-white/10" />
              <span className="block h-1 w-4/5 rounded-full bg-white/10" />
              <span className="block h-1 w-3/5 rounded-full bg-white/10" />
            </div>
          </div>
        </div>

        <div className={`${panelClass} relative z-20 min-h-44 border-[#FC734D]/30 text-center shadow-[0_-10px_50px_rgba(252,115,77,0.18)]`}>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-300 sm:text-xs">
            Proof Core
          </p>
          <div className="mx-auto my-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#0297DE]/50 bg-[#0297DE]/10 shadow-[0_0_28px_rgba(2,151,222,0.35)] sm:my-4 sm:h-20 sm:w-20">
            <span className="h-5 w-5 animate-pulse rounded-full bg-[#0297DE] shadow-[0_0_28px_#0297DE] sm:h-7 sm:w-7" />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              size="sm"
              to="/signup"
              className="hero-cta rounded-full border-0 px-3 text-[10px] font-semibold sm:px-4 sm:text-xs"
            >
              Build your proof
            </Button>
            <Button
              size="sm"
              variant="outline"
              href="#how-it-works"
              className="hero-secondary rounded-full px-3 text-[10px] sm:px-4 sm:text-xs"
            >
              Explore
            </Button>
          </div>
        </div>

        <div className={`${panelClass} min-h-36`}>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 sm:text-xs">
            Capability Signal
          </p>
          <div className="mt-4 space-y-2.5 sm:mt-5 sm:space-y-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#FC734D]" />
              <span className="h-1.5 w-4/5 rounded-full bg-white/30" />
            </div>
            <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
            <span className="block h-1.5 w-5/6 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
