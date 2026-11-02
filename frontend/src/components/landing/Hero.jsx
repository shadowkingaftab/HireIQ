import { motion } from "framer-motion";
import Button from "../ui/Button";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const panels = [
  { delay: 0, float: -5 },
  { delay: 0.25, float: -7 },
  { delay: 0.5, float: -4 },
];

const panelClass =
  "relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#06111B]/80 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent md:h-[22rem]";

function FloatingPanel({ children, className = "", delay, float, reducedMotion }) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={
        reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: [0, float, 0] }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.7, delay },
              y: {
                duration: 6.5 + delay,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              },
            }
      }
      className={`${panelClass} ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#02070A] px-4 pb-12 pt-32 text-white"
    >
      {/* BACKGROUND LIGHTING & GRID */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        
        {/* 1. The Massive Volumetric Glow (Using blurred divs for intensity) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] flex items-center justify-center">
          {/* Blue core glow */}
          <div className="absolute w-[800px] h-[600px] bg-[#0297DE] opacity-20 blur-[120px] rounded-full" />
          {/* Orange bottom glow */}
          <div className="absolute bottom-0 w-[600px] h-[300px] bg-[#FC734D] opacity-30 blur-[100px] rounded-full translate-y-20" />
        </div>

        {/* 2. The 3D Floor Grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-[45vh] opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            transform: "perspective(600px) rotateX(70deg)",
            transformOrigin: "center bottom",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
          }}
        />

        {/* 3. Thin Horizon Line */}
        <div className="absolute bottom-[45vh] left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-px bg-gradient-to-r from-transparent via-[#0297DE]/50 to-transparent shadow-[0_0_20px_rgba(2,151,222,0.8)]" />
      </div>

      {/* HERO TEXT CONTENT */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center space-y-6 px-4 text-center -mt-10">
        <motion.h1
          id="hero-title"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-[3.5rem] leading-[0.95] tracking-tighter text-white [text-shadow:0_0_30px_rgba(255,255,255,0.15)] sm:text-7xl md:text-8xl"
        >
          Don&apos;t just claim,
          <br />
          <span className="italic text-[#0297DE] [text-shadow:0_0_40px_rgba(2,151,222,0.4)]">
            Prove it.
          </span>
        </motion.h1>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: reducedMotion ? 0 : 0.12,
            ease: "easeOut",
          }}
          className="mx-auto max-w-xl font-sans text-base leading-relaxed text-gray-400 sm:text-lg"
        >
          ProofHire turns verified work into explainable capability signals.
          Recruiters see demonstrated skill, and every score traces back to its
          evidence.
        </motion.p>
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: reducedMotion ? 0 : 0.22,
            ease: "easeOut",
          }}
          className="flex flex-wrap justify-center gap-4 pt-4"
        >
          <Button
            to="/signup"
            className="hero-cta rounded-full border-0 bg-[#0297DE] px-8 py-3 font-semibold shadow-[0_0_25px_rgba(2,151,222,0.5)] transition-transform hover:scale-105"
          >
            Build your proof
          </Button>
          <Button
            variant="outline"
            href="#how-it-works"
            className="hero-secondary rounded-full border-white/20 px-8 py-3 transition-colors hover:bg-white/5"
          >
            Explore how it works
          </Button>
        </motion.div>
      </div>

      {/* THE 3 FLOATING PANELS */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          
          <FloatingPanel
            delay={panels[0].delay}
            float={panels[0].float}
            reducedMotion={reducedMotion}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Repository
              </p>
              <p className="mt-2 text-sm font-medium text-gray-200">
                Verified contribution
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#02070A]/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_14px_rgba(2,151,222,0.8)]" />
                <span className="h-1.5 w-24 rounded-full bg-white/20" />
              </div>
              <div className="space-y-3">
                <span className="block h-1.5 w-full rounded-full bg-white/10" />
                <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
                <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
              </div>
            </div>
          </FloatingPanel>

          <FloatingPanel
            delay={panels[1].delay}
            float={panels[1].float}
            reducedMotion={reducedMotion}
            className="items-center border-[#0297DE]/30 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_26px_80px_rgba(2,10,18,0.7),0_0_80px_rgba(2,151,222,0.2)] bg-[#06111B]/90"
          >
            <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300">
              Proof Core
            </p>
            <motion.div
              animate={reducedMotion ? { scale: 1 } : { scale: [1, 1.05, 1] }}
              transition={{
                duration: 5,
                repeat: reducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#0297DE]/40 bg-[radial-gradient(circle,rgba(2,151,222,0.15),transparent_70%)] shadow-[0_0_50px_rgba(2,151,222,0.3)]"
            >
              <span className="absolute inset-2 rounded-full border border-[#0297DE]/30" />
              <span className="absolute inset-5 rounded-full border border-dashed border-[#0297DE]/40" />
              <motion.span
                animate={
                  reducedMotion
                    ? { opacity: 0.9 }
                    : { opacity: [0.8, 1, 0.8], scale: [0.95, 1.1, 0.95] }
                }
                transition={{
                  duration: 3.5,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="h-10 w-10 rounded-full bg-[#0297DE] shadow-[0_0_40px_rgba(2,151,222,1)]"
              />
            </motion.div>
            <p className="text-xs text-gray-300">Evidence connected to skill</p>
          </FloatingPanel>

          <FloatingPanel
            delay={panels[2].delay}
            float={panels[2].float}
            reducedMotion={reducedMotion}
          >
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Capability Signal
              </p>
              <p className="mt-2 text-sm font-medium text-gray-200">Match score</p>
            </div>
            <div className="space-y-4 rounded-xl border border-white/5 bg-[#02070A]/60 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_12px_rgba(252,115,77,0.9)]" />
                <span className="h-1.5 w-4/5 rounded-full bg-gradient-to-r from-[#0297DE]/80 to-white/10" />
              </div>
              <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />
              <span className="block h-1.5 w-5/6 rounded-full bg-white/10" />
            </div>
          </FloatingPanel>

        </div>
      </div>
    </section>
  );
}