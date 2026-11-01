import { createRef, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { AnimatedBeam } from "../ui/animated-beam";
import { BorderBeam } from "../ui/border-beam";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

const EVIDENCE_PANELS = [
  { key: "repository", label: "Repository", meta: "payments-core" },
  { key: "assessment", label: "Assessment", meta: "Algorithms · 91" },
  { key: "contributions", label: "Contributions", meta: "24 months active" },
];

const SKILL_PANELS = [
  { key: "python", label: "Python" },
  { key: "fastapi", label: "FastAPI" },
  { key: "postgresql", label: "PostgreSQL" },
  { key: "docker", label: "Docker" },
];

const ALL_PANELS = [...EVIDENCE_PANELS, ...SKILL_PANELS];

function DataPanel({ panel, panelRef, reducedMotion, delay }) {
  return (
    <motion.div
      ref={panelRef}
      animate={reducedMotion ? { y: 0 } : { y: [0, -6, 0] }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
      }
      className="w-24 rounded-xl border border-white/10 border-t-white/20 bg-white/5 p-2.5 shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-md sm:w-36 sm:p-3"
    >
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-electric shadow-[0_0_8px_rgba(14,165,233,0.9)]"
          aria-hidden="true"
        />
        <span className="truncate text-[10px] font-medium text-stellar sm:text-xs">
          {panel.label}
        </span>
      </div>
      {panel.meta && (
        <p className="mt-1 hidden truncate font-mono text-[9px] text-nebula/70 sm:block">
          {panel.meta}
        </p>
      )}
    </motion.div>
  );
}

function ScorePanel({ scoreRef, reducedMotion }) {
  return (
    <motion.div
      ref={scoreRef}
      animate={reducedMotion ? { y: 0 } : { y: [0, -5, 0] }}
      transition={
        reducedMotion
          ? { duration: 0 }
          : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
      }
      className="relative w-24 overflow-hidden rounded-xl border border-cantaloupe/40 bg-cantaloupe/10 px-2.5 py-2 text-center shadow-[0_18px_40px_-24px_rgba(249,115,22,0.55)] backdrop-blur-md sm:w-32 sm:px-3 sm:py-2.5"
    >
      {!reducedMotion && (
        <BorderBeam
          size={24}
          duration={5}
          colorFrom="#F97316"
          colorTo="#0EA5E9"
          borderWidth={1}
          style={{ offsetPath: "rect(0 auto auto 0 round 12px)" }}
        />
      )}
      <div className="relative z-10">
        <span className="block font-mono text-xl font-bold leading-none text-cantaloupe sm:text-2xl">
          94
        </span>
        <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.2em] text-cantaloupe/80 sm:text-[9px]">
          Match
        </span>
      </div>
    </motion.div>
  );
}

function Core({ coreRef }) {
  return (
    <div
      ref={coreRef}
      className="relative h-32 w-32 shrink-0 sm:h-48 sm:w-48 lg:h-56 lg:w-56"
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.22),transparent_68%)] blur-2xl"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <circle cx="100" cy="100" r="94" className="holo-ring holo-ring-outer" />
        <circle cx="100" cy="100" r="74" className="holo-ring holo-ring-middle" />
        <circle cx="100" cy="100" r="54" className="holo-ring holo-ring-inner" />
        <g className="holo-ticks">
          {Array.from({ length: 12 }).map((_, index) => {
            const angle = (index * 30 * Math.PI) / 180;
            return (
              <line
                key={index}
                x1={100 + Math.cos(angle) * 88}
                y1={100 + Math.sin(angle) * 88}
                x2={100 + Math.cos(angle) * 94}
                y2={100 + Math.sin(angle) * 94}
              />
            );
          })}
        </g>
      </svg>
      <div
        className="holo-core absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-10 sm:w-10"
        aria-hidden="true"
      />
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_#fff] sm:h-2.5 sm:w-2.5"
        aria-hidden="true"
      />
      <span className="sr-only">Central capability core</span>
    </div>
  );
}

export default function HolographicCore() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef(null);
  const coreRef = useRef(null);
  const scoreRef = useRef(null);
  const panelRefs = useMemo(() => {
    const refs = {};
    ALL_PANELS.forEach(({ key }) => {
      refs[key] = createRef();
    });
    return refs;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return undefined;

    let frameId;
    let pointer = null;
    const setPanelDepth = (x, y) => {
      ALL_PANELS.forEach(({ key }, index) => {
        const node = panelRefs[key].current;
        if (!node) return;
        const depth = index < 3 ? 4 + index * 1.5 : 8 + (index - 3);
        node.style.translate = `${x * depth}px ${y * depth}px`;
      });
      if (scoreRef.current) scoreRef.current.style.translate = `${x * 12}px ${y * 12}px`;
    };

    const onPointerMove = (event) => {
      const bounds = container.getBoundingClientRect();
      pointer = {
        x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      };
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          if (pointer) setPanelDepth(pointer.x, pointer.y);
          frameId = undefined;
        });
      }
    };
    const onPointerLeave = () => {
      pointer = null;
      setPanelDepth(0, 0);
      if (frameId) cancelAnimationFrame(frameId);
      frameId = undefined;
    };

    container.addEventListener("pointermove", onPointerMove, { passive: true });
    container.addEventListener("pointerleave", onPointerLeave);
    return () => {
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [panelRefs, reducedMotion]);

  const beams = [
    ...EVIDENCE_PANELS.map((panel, index) => ({
      key: panel.key,
      fromRef: panelRefs[panel.key],
      toRef: coreRef,
      curvature: [28, 0, -28][index],
      delay: index * 0.4,
    })),
    ...SKILL_PANELS.map((panel, index) => ({
      key: panel.key,
      fromRef: panelRefs[panel.key],
      toRef: coreRef,
      curvature: [24, 8, -8, -24][index],
      delay: 0.2 + index * 0.4,
    })),
  ];

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label="Holographic capability core connecting evidence and verified skills to a 94 percent match."
      className="relative flex min-h-[360px] w-full items-center overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.07),transparent_62%)] px-2 py-6 sm:min-h-[480px] sm:px-6 sm:py-10 lg:min-h-[540px]"
    >
      <div className="absolute inset-0 z-0">
        {!reducedMotion && (
          <>
            {beams.map((beam) => (
              <AnimatedBeam
                key={beam.key}
                containerRef={containerRef}
                fromRef={beam.fromRef}
                toRef={beam.toRef}
                curvature={beam.curvature}
                delay={beam.delay}
                duration={5.5}
                pathColor="#0EA5E9"
                pathWidth={1}
                pathOpacity={0.12}
                gradientStartColor="#0EA5E9"
                gradientStopColor="#7DD3FC"
              />
            ))}
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={coreRef}
              toRef={scoreRef}
              curvature={-42}
              delay={0.6}
              duration={4.5}
              pathColor="#F97316"
              pathWidth={1}
              pathOpacity={0.16}
              gradientStartColor="#F97316"
              gradientStopColor="#0EA5E9"
            />
          </>
        )}
      </div>

      <div className="relative z-10 grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-6">
        <div className="flex flex-col items-end gap-2 sm:gap-4">
          {EVIDENCE_PANELS.map((panel, index) => (
            <DataPanel
              key={panel.key}
              panel={panel}
              panelRef={panelRefs[panel.key]}
              reducedMotion={reducedMotion}
              delay={index * 0.35}
            />
          ))}
        </div>

        <Core coreRef={coreRef} />

        <div className="flex flex-col items-start gap-2 sm:gap-4">
          <ScorePanel scoreRef={scoreRef} reducedMotion={reducedMotion} />
          {SKILL_PANELS.map((panel, index) => (
            <DataPanel
              key={panel.key}
              panel={panel}
              panelRef={panelRefs[panel.key]}
              reducedMotion={reducedMotion}
              delay={0.2 + index * 0.35}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
