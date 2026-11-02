export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#02070A] text-white">
      
      {/* 1. THE VOLUMETRIC GLOW (Unbreakable Inline CSS) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[70vh] z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(252, 115, 77, 0.6) 0%, rgba(2, 151, 222, 0.4) 40%, transparent 75%)',
          filter: 'blur(80px)',
        }}
      />

      {/* 2. THE 3D FLOOR GRID */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50vh] z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          transform: 'perspective(600px) rotateX(70deg)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        }}
      />

      {/* 3. HERO TEXT */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pt-40 flex flex-col items-center text-center">
        <h1 className="font-serif text-6xl md:text-8xl tracking-tighter leading-[0.95]">
          Don't just claim,
          <br />
          <span className="italic text-[#0297DE] drop-shadow-[0_0_30px_rgba(2,151,222,0.4)]">
            Prove it.
          </span>
        </h1>
        
        <p className="mt-8 max-w-xl text-base md:text-lg text-gray-400">
          ProofHire turns verified work into explainable capability signals.
          Recruiters see demonstrated skill, and every score traces back to its evidence.
        </p>

        {/* 4. STATS & BUTTON (Strict Grid - Cannot Overlap) */}
        <div className="mt-16 w-full max-w-3xl grid grid-cols-3 items-center gap-4">
          
          {/* Left Stat */}
          <div className="flex flex-col items-end text-right">
            <span className="font-serif text-4xl md:text-5xl text-white">100%</span>
            <span className="mt-2 font-mono text-[10px] tracking-widest text-gray-500 uppercase">Evidence Backed</span>
          </div>

          {/* Center Button */}
          <div className="flex justify-center">
            <button className="rounded-full bg-[#0297DE] px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_rgba(2,151,222,0.5)] transition-transform hover:scale-105 whitespace-nowrap">
              Build your proof
            </button>
          </div>

          {/* Right Stat */}
          <div className="flex flex-col items-start text-left">
            <span className="font-serif text-4xl md:text-5xl text-white">94</span>
            <span className="mt-2 font-mono text-[10px] tracking-widest text-gray-500 uppercase">Match Score</span>
          </div>

        </div>
      </div>

      {/* 5. THE BOTTOM PANELS (Strict Grid - Cannot Bleed) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Panel */}
          <div className="flex h-[260px] flex-col justify-between rounded-t-2xl border border-white/10 border-b-0 bg-[#06111B]/80 p-6 shadow-2xl backdrop-blur-xl">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Repository</p>
              <p className="mt-1 text-sm font-medium text-gray-200">Verified contribution</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#02070A]/50 p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_10px_#0297DE]" />
                <div className="h-1.5 w-24 rounded-full bg-white/20" />
              </div>
              <div className="space-y-3">
                <div className="h-1.5 w-full rounded-full bg-white/10" />
                <div className="h-1.5 w-4/5 rounded-full bg-white/10" />
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="relative flex h-[260px] flex-col items-center justify-between rounded-t-2xl border border-[#0297DE]/30 border-b-0 bg-[#06111B]/90 p-6 shadow-[0_-20px_60px_rgba(2,151,222,0.15)] backdrop-blur-xl">
            <p className="w-full text-left font-mono text-[10px] uppercase tracking-widest text-gray-400">Proof Core</p>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#0297DE]/30 bg-[#0297DE]/5">
              <div className="absolute inset-2 rounded-full border border-[#0297DE]/20" />
              <div className="absolute inset-4 rounded-full border border-dashed border-[#0297DE]/30" />
              <div className="h-6 w-6 rounded-full bg-[#0297DE] shadow-[0_0_30px_#0297DE]" />
            </div>
            <p className="text-xs text-gray-400">Evidence connected to skill</p>
          </div>

          {/* Right Panel */}
          <div className="flex h-[260px] flex-col justify-between rounded-t-2xl border border-white/10 border-b-0 bg-[#06111B]/80 p-6 shadow-2xl backdrop-blur-xl">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Capability Signal</p>
              <p className="mt-1 text-sm font-medium text-gray-200">Match score</p>
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