
import { motion } from "framer-motion";
import Button from "../ui/Button";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/* -------------------------------------------------------
   CONFIGURATION
------------------------------------------------------- */

const panels = [
  { delay: 0, float: -5 },
  { delay: 0.25, float: -7 },
  { delay: 0.5, float: -4 },
];

/*
 * Generate deterministic vertical light filaments.
 * The filaments rise from a shared illuminated horizon.
 * Their heights increase towards the central light source.
 */

const FLAME_RAYS = Array.from({ length: 112 }, (_, i) => {
  const t = i / 111;
  const x = t * 1440;

  const distance = Math.abs(t - 0.5) * 2;
  const envelope = Math.pow(1 - distance, 0.8);

  const noise = (Math.sin(i * 12.9898) + 1) / 2;
  const height = 65 + envelope * (190 + noise * 170);

  const lean = Math.sin(i * 1.71) * (8 + envelope * 16);

  const topY = 530 - height;

  return {
    id: i,
    d: `
      M ${x} 530
      C ${x + lean * 0.2} ${530 - height * 0.35},
        ${x + lean} ${530 - height * 0.72},
        ${x + lean * 0.65} ${topY}
    `,
    opacity: 0.28 + envelope * 0.48 + noise * 0.12,
    width: 0.5 + noise * 0.85,
    warm: envelope > 0.42 && i % 5 === 0,
    duration: 3.5 + noise * 3.5,
    delay: -(noise * 5),
  };
});

const panelClass =
  "relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#06111B]/80 p-6 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_24px_70px_rgba(0,0,0,0.6)] before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent md:h-[22rem]";

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
      initial={reducedMotion ? false : { opacity: 0, y: 18 }}
      animate={
        reducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 1, y: [0, float, 0] }
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

/* -------------------------------------------------------
   CINEMATIC FLAME / LIGHT FILAMENT ENVIRONMENT
------------------------------------------------------- */

function FlameAtmosphere({ reducedMotion }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Deep atmospheric blue background */}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_75%,rgba(2,55,83,0.24),transparent_65%)]" />

      {/* Broad blue volumetric illumination */}

      <motion.div
        className="absolute bottom-[-20%] left-1/2 h-[75vh] w-[120%] -translate-x-1/2 rounded-[50%] blur-[100px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, rgba(2,151,222,0.32) 0%, rgba(2,151,222,0.13) 38%, transparent 75%)",
        }}
        animate={
          reducedMotion
            ? { opacity: 0.85 }
            : {
                opacity: [0.7, 0.95, 0.7],
                scale: [1, 1.06, 1],
              }
        }
        transition={{
          duration: 12,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Warm lower light source */}

      <motion.div
        className="absolute bottom-[-19%] left-1/2 h-[48vh] w-[85%] -translate-x-1/2 rounded-[50%] blur-[90px]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(252,115,77,0.42) 0%, rgba(252,115,77,0.17) 28%, rgba(252,115,77,0.04) 56%, transparent 75%)",
        }}
        animate={
          reducedMotion
            ? { opacity: 0.8 }
            : {
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.09, 1],
              }
        }
        transition={{
          duration: 9,
          repeat: reducedMotion ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Fine atmospheric vertical light shafts */}

      <div
        className="absolute bottom-[17%] left-1/2 h-[48vh] w-[90%] -translate-x-1/2 opacity-35 blur-[35px]"
        style={{
          background:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 32px, rgba(2,151,222,0.15) 33px, transparent 35px, transparent 62px)",
          maskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 100%, black 0%, transparent 78%)",
        }}
      />

      {/* ------------------------------------------------
          THE LIGHT FILAMENT FIELD
          Fine animated lines rising from the horizon.
      ------------------------------------------------ */}

      <svg
        viewBox="0 0 1440 530"
        preserveAspectRatio="none"
        className="absolute bottom-[-1%] left-0 h-[64%] min-h-[340px] w-full overflow-visible"
      >
        <defs>
          {/* Blue line gradient */}

          <linearGradient
            id="proofhire-ray-blue"
            x1="0"
            y1="0"
            x2="0"
            y2="530"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#0297DE" stopOpacity="0" />
            <stop offset="35%" stopColor="#0297DE" stopOpacity="0.15" />
            <stop offset="72%" stopColor="#0297DE" stopOpacity="0.8" />
            <stop offset="91%" stopColor="#42C9FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.65" />
          </linearGradient>

          {/* Warm filament gradient */}

          <linearGradient
            id="proofhire-ray-warm"
            x1="0"
            y1="0"
            x2="0"
            y2="530"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FC734D" stopOpacity="0" />
            <stop offset="48%" stopColor="#FC734D" stopOpacity="0.08" />
            <stop offset="80%" stopColor="#FC734D" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FFE4D5" stopOpacity="0.95" />
          </linearGradient>

          {/* Central flame gradient */}

          <linearGradient
            id="proofhire-flame"
            x1="0"
            y1="530"
            x2="0"
            y2="140"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="18%" stopColor="#FC734D" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#0297DE" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0297DE" stopOpacity="0" />
          </linearGradient>

          <radialGradient id="proofhire-horizon">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="14%" stopColor="#FFD6C5" stopOpacity="0.85" />
            <stop offset="38%" stopColor="#FC734D" stopOpacity="0.5" />
            <stop offset="70%" stopColor="#0297DE" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0297DE" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="proofhire-blue-horizon">
            <stop offset="0%" stopColor="#42C9FF" stopOpacity="0.65" />
            <stop offset="55%" stopColor="#0297DE" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0297DE" stopOpacity="0" />
          </radialGradient>

          <filter id="proofhire-soft-glow">
            <feGaussianBlur stdDeviation="12" />
          </filter>

          <filter id="proofhire-hot-glow">
            <feGaussianBlur stdDeviation="24" />
          </filter>

        </defs>

        {/* Broad blue light spreading from the horizon */}

        <ellipse
          cx="720"
          cy="475"
          rx="650"
          ry="125"
          fill="url(#proofhire-blue-horizon)"
          filter="url(#proofhire-hot-glow)"
        />

        {/* Main atmospheric flame body */}

        <g filter="url(#proofhire-soft-glow)">
          <path
            d="
              M 390 530
              C 495 485, 570 435, 615 310
              C 650 380, 623 443, 678 498
              C 710 455, 710 350, 720 220
              C 760 350, 755 424, 784 493
              C 842 420, 810 348, 866 290
              C 875 407, 930 482, 1050 530
              Z
            "
            fill="url(#proofhire-flame)"
            opacity="0.58"
          />

          <path
            d="
              M 590 530
              C 650 475, 690 440, 693 335
              C 730 420, 740 460, 770 530
              Z
            "
            fill="url(#proofhire-flame)"
            opacity="0.55"
          />
        </g>

        {/* Hundreds of thin vertical rising filaments */}

        <g>
          {FLAME_RAYS.map((ray) => (
            <path
              key={ray.id}
              d={ray.d}
              fill="none"
              stroke={
                ray.warm
                  ? "url(#proofhire-ray-warm)"
                  : "url(#proofhire-ray-blue)"
              }
              strokeWidth={ray.width}
              strokeLinecap="round"
              opacity={ray.opacity}
              className={
                reducedMotion ? "" : "proofhire-flame-ray"
              }
              style={
                reducedMotion
                  ? undefined
                  : {
                      animationDelay: `${ray.delay}s`,
                      animationDuration: `${ray.duration}s`,
                    }
              }
            />
          ))}
        </g>

        {/* Brighter central flame filaments */}

        <g filter="url(#proofhire-soft-glow)">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const x = 610 + i * 37;
            const height = 170 + (i % 3) * 55;

            return (
              <path
                key={i}
                d={`
                  M ${x} 530
                  C ${x - 18} ${530 - height * 0.4},
                    ${x + 20} ${530 - height * 0.75},
                    ${x + 4} ${530 - height}
                `}
                fill="none"
                stroke="url(#proofhire-ray-warm)"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            );
          })}
        </g>

        {/* The hot white-orange center of the flame */}

        <ellipse
          cx="720"
          cy="507"
          rx="330"
          ry="52"
          fill="url(#proofhire-horizon)"
          filter="url(#proofhire-hot-glow)"
        />

        <ellipse
          cx="720"
          cy="505"
          rx="170"
          ry="17"
          fill="url(#proofhire-horizon)"
          filter="url(#proofhire-soft-glow)"
          opacity="0.9"
        />

        <ellipse
          cx="720"
          cy="505"
          rx="75"
          ry="4"
          fill="#FFE5D9"
          opacity="0.28"
          filter="url(#proofhire-soft-glow)"
        />
      </svg>

      {/* ------------------------------------------------
          PERSPECTIVE FLOOR GRID
      ------------------------------------------------ */}

      <div
        className="absolute inset-x-[-15%] bottom-[-22%] h-[53vh] opacity-[0.24]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          transform: "perspective(600px) rotateX(66deg)",
          transformOrigin: "center bottom",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 42%, black 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 42%, black 100%)",
        }}
      />

      {/* Illuminated horizon line */}

      <div
        className="absolute bottom-[25%] left-1/2 h-px w-[85%] max-w-[1100px] -translate-x-1/2"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(2,151,222,0.25) 25%, rgba(255,210,190,0.65) 50%, rgba(2,151,222,0.25) 75%, transparent)",
          boxShadow: "0 0 24px rgba(2,151,222,0.35)",
        }}
      />

      {/* Top vignette for cinematic depth */}

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(2,7,10,0.55) 0%, transparent 35%, transparent 75%, rgba(2,7,10,0.25) 100%)",
        }}
      />

    </div>
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
      className="relative isolate flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#02070A] px-4 pb-12 pt-32 text-white"
    >

      {/* Cinematic background environment */}

      <FlameAtmosphere reducedMotion={reducedMotion} />

      {/* HERO TEXT CONTENT */}

      <div className="relative z-10 mx-auto -mt-10 flex w-full max-w-4xl flex-col items-center space-y-6 px-4 text-center">

        <motion.h1
          id="hero-title"
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
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

      {/* FLOATING PROOF PANELS */}

      <div className="relative z-10 mx-auto mt-16 w-full max-w-6xl px-4">

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">

          {/* REPOSITORY */}

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

          {/* PROOF CORE */}

          <FloatingPanel
            delay={panels[1].delay}
            float={panels[1].float}
            reducedMotion={reducedMotion}
            className="items-center border-[#0297DE]/30 bg-[#06111B]/90 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_26px_80px_rgba(2,10,18,0.7),0_0_80px_rgba(2,151,222,0.2)]"
          >

            <p className="self-start font-mono text-[10px] uppercase tracking-[0.2em] text-gray-300">
              Proof Core
            </p>

            <motion.div
              animate={
                reducedMotion
                  ? { scale: 1 }
                  : { scale: [1, 1.05, 1] }
              }
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
                    : {
                        opacity: [0.8, 1, 0.8],
                        scale: [0.95, 1.1, 0.95],
                      }
                }
                transition={{
                  duration: 3.5,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="h-10 w-10 rounded-full bg-[#0297DE] shadow-[0_0_40px_rgba(2,151,222,1)]"
              />

            </motion.div>

            <p className="text-xs text-gray-300">
              Evidence connected to skill
            </p>

          </FloatingPanel>

          {/* CAPABILITY SIGNAL */}

          <FloatingPanel
            delay={panels[2].delay}
            float={panels[2].float}
            reducedMotion={reducedMotion}
          >

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-500">
                Capability Signal
              </p>

              <p className="mt-2 text-sm font-medium text-gray-200">
                Match score
              </p>
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

      {/* LOCAL ANIMATION STYLES */}

      <style>{`
        @keyframes proofhire-flame-flicker {
          0%, 100% {
            opacity: 0.35;
            transform: scaleY(0.82);
          }

          50% {
            opacity: 0.9;
            transform: scaleY(1.08);
          }
        }

        .proofhire-flame-ray {
          transform-box: fill-box;
          transform-origin: center bottom;
          animation-name: proofhire-flame-flicker;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .proofhire-flame-ray {
            animation: none !important;
          }
        }
      `}</style>

    </section>
  );
}
