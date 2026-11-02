import { motion } from "framer-motion";
import Button from "../ui/Button";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/* -------------------------------------------------------
   CONFIGURATION
------------------------------------------------------- */

const panels = [
  { delay: 0, float: -5 },
  { delay: 0.3, float: -7 },
  { delay: 0.6, float: -4 },
];

const flamePlumes = [
  { x: "34%", width: "5%", height: "180px", delay: 0, warm: false },
  { x: "40%", width: "4%", height: "250px", delay: 0.5, warm: true },
  { x: "46%", width: "5%", height: "205px", delay: 0.2, warm: false },
  { x: "50%", width: "7%", height: "300px", delay: 0.8, warm: true },
  { x: "55%", width: "5%", height: "225px", delay: 0.3, warm: false },
  { x: "61%", width: "4%", height: "260px", delay: 0.6, warm: true },
  { x: "66%", width: "5%", height: "175px", delay: 0.1, warm: false },
];

const panelClass =
  "relative flex h-[280px] flex-col justify-between overflow-hidden rounded-t-2xl border border-b-0 border-white/10 border-t-white/20 bg-[#050B14]/80 p-6 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]";

/* -------------------------------------------------------
   FLOATING PANEL
------------------------------------------------------- */

function FloatingPanel({
  children,
  className = "",
  delay,
  float,
  reducedMotion,
}) {
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0, y: 20 }}
      animate={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, float, 0] }
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.8, delay },
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

/* -------------------------------------------------------
   CINEMATIC BACKGROUND
------------------------------------------------------- */

function CinematicBackground({ reducedMotion }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Deep atmospheric background */}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_65%,rgba(5,24,37,0.35),transparent_65%)]" />

      {/* Main volumetric light source */}

      <motion.div
        className="absolute h-[80vh] w-[150vw] max-w-[1500px] rounded-full"
        style={{
          bottom: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse at bottom, #FC734D 0%, #0297DE 40%, transparent 75%)",
          filter: "blur(100px)",
          opacity: 0.6,
        }}
        animate={
          reducedMotion
            ? { opacity: 0.6 }
            : {
                opacity: [0.48, 0.68, 0.48],
                scale: [1, 1.045, 1],
              }
        }
        transition={{
          duration: 11,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Concentrated blue illumination */}

      <motion.div
        className="absolute bottom-[3%] left-1/2 h-[48vh] w-[80vw] max-w-[1050px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(2,151,222,0.42) 0%, rgba(2,151,222,0.18) 38%, transparent 75%)",
          filter: "blur(75px)",
        }}
        animate={
          reducedMotion
            ? { opacity: 0.8 }
            : { opacity: [0.65, 0.9, 0.65] }
        }
        transition={{
          duration: 9,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Warm central light source */}

      <motion.div
        className="absolute bottom-[-2%] left-1/2 h-[35vh] w-[48vw] max-w-[650px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,207,177,0.85) 0%, rgba(252,115,77,0.55) 15%, rgba(252,115,77,0.18) 43%, transparent 75%)",
          filter: "blur(65px)",
        }}
        animate={
          reducedMotion
            ? { opacity: 0.7 }
            : {
                opacity: [0.55, 0.82, 0.55],
                scaleX: [0.95, 1.08, 0.95],
              }
        }
        transition={{
          duration: 7,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* -------------------------------------------------
         FLAME-LIKE LIGHT TONGUES
      ------------------------------------------------- */}

      <div className="absolute bottom-[12%] left-0 h-[43vh] w-full overflow-hidden">
        {flamePlumes.map((plume, index) => (
          <motion.div
            key={index}
            className="absolute bottom-0 rounded-[50%]"
            style={{
              left: plume.x,
              width: plume.width,
              height: plume.height,
              transformOrigin: "bottom center",
              background: plume.warm
                ? "radial-gradient(ellipse at 50% 100%, rgba(255,224,206,0.65) 0%, rgba(252,115,77,0.34) 30%, rgba(252,115,77,0.08) 65%, transparent 100%)"
                : "radial-gradient(ellipse at 50% 100%, rgba(66,201,255,0.65) 0%, rgba(2,151,222,0.38) 35%, rgba(2,151,222,0.08) 70%, transparent 100%)",
              filter: "blur(15px)",
            }}
            animate={
              reducedMotion
                ? { opacity: 0.55, scaleY: 1 }
                : {
                    opacity: [0.3, 0.65, 0.4, 0.6, 0.3],
                    scaleY: [0.82, 1.08, 0.93, 1.04, 0.82],
                    scaleX: [1, 0.92, 1.08, 0.96, 1],
                  }
            }
            transition={{
              duration: 4.5 + index * 0.35,
              delay: plume.delay,
              repeat: reducedMotion ? 0 : Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* -------------------------------------------------
         FINE VERTICAL LIGHT LINES
      ------------------------------------------------- */}

      <div
        className="absolute bottom-[13%] left-1/2 h-[38vh] w-[90%] -translate-x-1/2"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 13px, rgba(2,151,222,0.24) 14px, transparent 15px, transparent 27px)",
          maskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, rgba(0,0,0,0.7) 35%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, rgba(0,0,0,0.7) 35%, transparent 78%)",
        }}
      />

      <div
        className="absolute bottom-[12%] left-1/2 h-[26vh] w-[55%] -translate-x-1/2 opacity-70"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 22px, rgba(252,115,77,0.25) 23px, transparent 24px, transparent 37px)",
          maskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, transparent 75%)",
        }}
      />

      {/* Fine bright horizon */}

      <div
        className="absolute bottom-[25%] left-1/2 h-px w-[85%] max-w-[1150px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(2,151,222,0.35) 24%, rgba(255,218,196,0.8) 50%, rgba(2,151,222,0.35) 76%, transparent)",
          boxShadow:
            "0 0 18px rgba(2,151,222,0.35), 0 0 35px rgba(252,115,77,0.2)",
        }}
      />

      {/* -------------------------------------------------
         PERSPECTIVE FLOOR GRID
      ------------------------------------------------- */}

      <div
        className="absolute inset-x-[-15%] bottom-[-21%] h-[53vh] opacity-35"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(600px) rotateX(60deg)",
          transformOrigin: "center bottom",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 45%, black 100%)",
        }}
      />

      {/* Soft cinematic vignette */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,7,10,0.5) 0%, transparent 35%, transparent 75%, rgba(2,7,10,0.2) 100%)",
        }}
      />
    </div>
  );
}

/* -------------------------------------------------------
   SIDE STATISTICS
------------------------------------------------------- */

function SideStats() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden items-center justify-between md:flex">
      <div className="relative z-10 text-left">
        <p className="font-serif text-4xl tracking-tight text-white lg:text-5xl">
          100%
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
          Evidence Backed
        </p>
      </div>

      <div className="relative z-10 text-right">
        <p className="font-serif text-4xl tracking-tight text-white lg:text-5xl">
          94
        </p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
          Match Score
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   CENTER PLAY BUTTON
------------------------------------------------------- */

function CenterPlayButton() {
  return (
    <a
      href="#how-it-works"
      aria-label="Explore how ProofHire works"
      className="group relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(252,115,77,0.5),0_0_60px_rgba(2,151,222,0.2)] transition-all duration-500 hover:scale-110 hover:border-white/40 hover:bg-white/15"
    >
      <span className="absolute inset-[-8px] rounded-full border border-white/10 opacity-0 transition-all duration-500 group-hover:inset-[-12px] group-hover:opacity-100" />

      <svg
        viewBox="0 0 24 24"
        className="ml-0.5 h-5 w-5 fill-white transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      >
        <path d="M7 4.8c0-.78.86-1.25 1.52-.83l11.1 7.2a1 1 0 0 1 0 1.66l-11.1 7.2A1 1 0 0 1 7 19.2V4.8Z" />
      </svg>
    </a>
  );
}

/* -------------------------------------------------------
   MAIN HERO
------------------------------------------------------- */

export default function Hero() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-[#02070A] px-4 pt-32 text-white"
    >
      {/* BACKGROUND ENVIRONMENT */}

      <CinematicBackground reducedMotion={reducedMotion} />

      {/* HERO CONTENT */}

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center">
        <motion.h1
          id="hero-title"
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.85,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="font-serif text-6xl leading-[1.1] tracking-tighter text-white sm:text-7xl md:text-8xl"
        >
          Don&apos;t just claim,
          <br />
          <span className="mt-2 inline-block italic text-[#0297DE] [text-shadow:0_0_15px_rgba(2,151,222,0.5)]">
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
          className="mx-auto mt-6 max-w-xl font-sans text-lg leading-relaxed text-gray-400"
        >
          ProofHire turns verified work into explainable capability signals.
          Recruiters see demonstrated skill, and every score traces back to its
          evidence.
        </motion.p>

        {/* CENTER BUTTON + FLOATING SIDE STATS */}

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: reducedMotion ? 0 : 0.25,
          }}
          className="relative mt-12 flex w-full max-w-5xl items-center justify-center"
        >
          {/* Connecting horizontal line */}

          <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden -translate-y-1/2 border-t border-white/10 md:block" />

          <SideStats />

          <CenterPlayButton />
        </motion.div>

        {/* PRIMARY CTA */}

        <div className="mt-6">
          <Button
            to="/signup"
            className="hero-cta rounded-full border-0 bg-[#0297DE] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(2,151,222,0.25)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(2,151,222,0.45)]"
          >
            Build your proof
          </Button>
        </div>
      </div>

      {/* -------------------------------------------------
         BOTTOM FLOATING SHELF
      ------------------------------------------------- */}

      <div className="relative z-10 mx-auto mt-auto w-full max-w-6xl pt-24">
        <div className="grid grid-cols-1 items-stretch gap-5 px-0 md:grid-cols-3 md:gap-6">

          {/* REPOSITORY PANEL */}

          <FloatingPanel
            delay={panels[0].delay}
            float={panels[0].float}
            reducedMotion={reducedMotion}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                Repository
              </p>

              <p className="mt-2 text-sm font-medium text-gray-200">
                Verified contribution
              </p>
            </div>

            <div className="relative rounded-lg border border-white/10 bg-[#02070A]/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="mb-5 flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#0297DE] shadow-[0_0_14px_rgba(2,151,222,0.9)]" />
                <span className="h-1.5 w-28 rounded-full bg-white/20" />
              </div>

              <div className="space-y-3">
                <span className="block h-1.5 w-full rounded-full bg-white/10" />
                <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
                <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
              </div>

              <div className="absolute bottom-0 right-0 h-16 w-24 bg-[radial-gradient(ellipse_at_bottom_right,rgba(2,151,222,0.12),transparent_70%)]" />
            </div>
          </FloatingPanel>

          {/* PROOF CORE PANEL */}

          <FloatingPanel
            delay={panels[1].delay}
            float={panels[1].float}
            reducedMotion={reducedMotion}
            className="items-center border-[#0297DE]/25 bg-[#050B14]/90 text-center shadow-[0_-20px_50px_rgba(0,0,0,0.5),0_0_45px_rgba(2,151,222,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            <p className="self-start font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
              Proof Core
            </p>

            <motion.div
              animate={
                reducedMotion
                  ? { scale: 1 }
                  : { scale: [1, 1.055, 1] }
              }
              transition={{
                duration: 5,
                repeat: reducedMotion ? 0 : Infinity,
                ease: "easeInOut",
              }}
              className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#0297DE]/40 bg-[radial-gradient(circle,rgba(2,151,222,0.18),rgba(2,151,222,0.04)_45%,transparent_72%)] shadow-[0_0_45px_rgba(2,151,222,0.25)]"
            >
              <motion.span
                animate={
                  reducedMotion
                    ? { opacity: 0.5 }
                    : { rotate: 360 }
                }
                transition={{
                  duration: 35,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "linear",
                }}
                className="absolute inset-3 rounded-full border border-dashed border-[#0297DE]/40"
              />

              <span className="absolute inset-6 rounded-full border border-[#0297DE]/30" />

              <motion.span
                animate={
                  reducedMotion
                    ? { scale: 1, opacity: 1 }
                    : {
                        scale: [0.92, 1.12, 0.92],
                        opacity: [0.8, 1, 0.8],
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="h-9 w-9 rounded-full bg-[#0297DE] shadow-[0_0_35px_#0297DE,0_0_65px_rgba(2,151,222,0.45)]"
              />
            </motion.div>

            <p className="text-xs text-gray-300">
              Evidence connected to skill
            </p>
          </FloatingPanel>

          {/* CAPABILITY SIGNAL PANEL */}

          <FloatingPanel
            delay={panels[2].delay}
            float={panels[2].float}
            reducedMotion={reducedMotion}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                Capability Signal
              </p>

              <p className="mt-2 text-sm font-medium text-gray-200">
                Match score
              </p>
            </div>

            <div className="space-y-5 rounded-lg border border-white/10 bg-[#02070A]/75 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_14px_rgba(252,115,77,0.9)]" />

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "88%" }}
                    transition={{
                      duration: reducedMotion ? 0 : 1.6,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-[#0297DE] to-[#42C9FF] shadow-[0_0_12px_rgba(2,151,222,0.4)]"
                  />
                </div>
              </div>

              <div className="h-1.5 w-3/4 rounded-full bg-white/10" />

              <div className="h-1.5 w-5/6 rounded-full bg-white/10" />
            </div>
          </FloatingPanel>

        </div>
      </div>

    </section>
  );
}