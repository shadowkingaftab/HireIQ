import Button from "../ui/Button";

const panelClass =
  "flex h-64 flex-col justify-between rounded-2xl border border-white/10 bg-[#050B14]/80 p-6 backdrop-blur-xl";

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-screen flex-col items-center justify-start overflow-hidden bg-[#02070A] px-4 pb-20 pt-32 text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[600px] w-full max-w-[1200px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(252, 115, 77, 0.4) 0%, rgba(2, 151, 222, 0.2) 40%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center space-y-6 px-4 text-center">
        <h1
          id="hero-title"
          className="font-serif text-6xl leading-[0.98] tracking-tight text-white sm:text-7xl md:text-8xl"
        >
          Don&apos;t just claim,
          <br />
          <span className="italic text-[#0297DE]">Prove it.</span>
        </h1>
        <p className="mx-auto max-w-2xl font-sans text-lg leading-relaxed text-gray-400 md:text-xl">
          ProofHire turns verified work into explainable capability signals.
          Recruiters see demonstrated skill, and every score traces back to its
          evidence.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button
            to="/signup"
            className="hero-cta rounded-full border-0 px-7 font-semibold"
          >
            Build your proof
          </Button>
          <Button
            variant="outline"
            href="#how-it-works"
            className="hero-secondary rounded-full px-7"
          >
            Explore how it works
          </Button>
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-24 w-full max-w-6xl px-0 sm:px-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className={panelClass}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
                Repository
              </p>
              <p className="mt-2 text-sm text-gray-200">
                Verified contribution
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_12px_#0297DE]" />
                <span className="h-1.5 w-28 rounded-full bg-white/30" />
              </div>
              <div className="space-y-2">
                <span className="block h-1.5 w-full rounded-full bg-white/10" />
                <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
                <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>
          </div>

          <div
            className={`${panelClass} items-center border-[#FC734D]/25 text-center`}
          >
            <p className="self-start font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
              Proof Core
            </p>
            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-[#0297DE]/40 bg-[#0297DE]/10 shadow-[0_0_40px_rgba(2,151,222,0.18)]">
              <span className="h-10 w-10 animate-pulse rounded-full bg-[#0297DE] shadow-[0_0_30px_#0297DE]" />
            </div>
            <p className="text-sm text-gray-300">Evidence connected to skill</p>
          </div>

          <div className={panelClass}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-gray-400">
                Capability Signal
              </p>
              <p className="mt-2 text-sm text-gray-200">Match score</p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_10px_#FC734D]" />
                <span className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-[#0297DE]/70 to-white/10" />
              </div>
              <span className="block h-1.5 w-2/3 rounded-full bg-white/15" />
              <span className="block h-1.5 w-5/6 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
