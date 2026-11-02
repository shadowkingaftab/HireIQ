import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden bg-[#02070A] px-4 pt-32 text-white">
      
      {/* 1. THE VOLUMETRIC LIGHTING (Background Layers) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden flex flex-col items-center justify-end">
        {/* The Massive Blue Core Light */}
        <div className="absolute bottom-[-10%] w-[120vw] max-w-[1200px] h-[60vh] bg-[#0297DE] opacity-30 blur-[120px] rounded-[100%]" />
        
        {/* The Orange Under-Glow (Floating at the very bottom) */}
        <div className="absolute bottom-[-20%] w-[80vw] max-w-[800px] h-[40vh] bg-[#FC734D] opacity-40 blur-[100px] rounded-[100%]" />

        {/* The 3D Perspective Floor Grid */}
        <div
          className="absolute bottom-0 w-full h-[40vh] opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: "perspective(600px) rotateX(70deg)",
            transformOrigin: "center bottom",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 100%)",
          }}
        />
      </div>

      {/* 2. HERO TEXT & CENTER CTA */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <h1 className="font-serif text-6xl leading-[0.95] tracking-tighter text-white sm:text-7xl md:text-[6.5rem]">
          Don't just claim,
          <br />
          <span className="italic text-[#0297DE] [text-shadow:0_0_40px_rgba(2,151,222,0.5)]">
            Prove it.
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-xl font-sans text-base leading-relaxed text-gray-400 sm:text-lg">
          ProofHire turns verified work into explainable capability signals.
          Recruiters see demonstrated skill, and every score traces back to its evidence.
        </p>

        {/* The Center Action Area (Stats + Button) */}
        <div className="relative mt-16 flex w-full max-w-3xl items-center justify-center">
          
          {/* Left Stat */}
          <div className="hidden flex-col items-end pr-12 md:flex">
            <span className="font-serif text-4xl text-white">100%</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Evidence Backed</span>
          </div>

          {/* Center Button */}
          <button className="relative rounded-full bg-[#0297DE] px-8 py-4 font-semibold text-white shadow-[0_0_40px_rgba(2,151,222,0.6)] transition-transform hover:scale-105">
            Build your proof
          </button>

          {/* Right Stat */}
          <div className="hidden flex-col items-start pl-12 md:flex">
            <span className="font-serif text-4xl text-white">94</span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Match Score</span>
          </div>

          {/* Connecting Lines for Stats */}
          <div className="absolute top-1/2 left-0 right-0 -z-10 hidden h-px bg-gradient-to-r from-transparent via-white/20 to-transparent md:block" />
        </div>
      </div>

      {/* 3. THE BOTTOM SHELF PANELS */}
      <div className="relative z-10 mt-24 w-full max-w-6xl mx-auto flex-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Left Panel */}
          <div className="flex h-[280px] flex-col justify-between rounded-t-2xl border border-white/10 border-b-0 bg-[#06111B]/80 p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Repository</p>
              <p className="mt-2 text-sm font-medium text-gray-200">Verified contribution</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#02070A]/50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_10px_#0297DE]" />
                <div className="h-1.5 w-24 rounded-full bg-white/20" />
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
                <div className="h-1.5 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="relative flex h-[280px] flex-col items-center justify-between rounded-t-2xl border border-[#0297DE]/30 border-b-0 bg-[#06111B]/90 p-6 shadow-[0_-20px_80px_rgba(2,151,222,0.2)] backdrop-blur-xl">
            <p className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-gray-400">Proof Core</p>
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[#0297DE]/30 bg-[#0297DE]/5">
              <div className="absolute inset-2 rounded-full border border-[#0297DE]/20" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[#0297DE]/30" />
              <div className="h-8 w-8 rounded-full bg-[#0297DE] shadow-[0_0_30px_#0297DE]" />
            </div>
            <p className="text-xs text-gray-400">Evidence connected to skill</p>
          </div>

          {/* Right Panel */}
          <div className="flex h-[280px] flex-col justify-between rounded-t-2xl border border-white/10 border-b-0 bg-[#06111B]/80 p-6 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Capability Signal</p>
              <p className="mt-2 text-sm font-medium text-gray-200">Match score</p>
            </div>
            <div className="space-y-4 rounded-xl border border-white/5 bg-[#02070A]/50 p-5">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_10px_#FC734D]" />
                <div className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-[#0297DE]/80 to-white/10" />
              </div>
              <div className="h-1.5 w-2/3 rounded-full bg-white/10" />
              <div className="h-1.5 w-5/6 rounded-full bg-white/10" />
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}