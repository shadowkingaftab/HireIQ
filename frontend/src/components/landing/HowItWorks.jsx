import { BadgeCheck, GitBranch, Orbit, Target } from "lucide-react";
import Reveal from "./Reveal";
import Container from "../ui/Container";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Build your proof",
    description:
      "Connect the work that matters — repositories, assessments and contributions — and verify what's yours.",
    className: "md:col-span-2 md:row-span-2",
    visual: (
      <div className="relative h-full min-h-32 overflow-hidden rounded-xl border border-white/[0.07] bg-[#07111a]/80 p-4 sm:p-5">
        <div className="absolute -right-10 -top-16 h-44 w-44 rounded-full bg-electric/15 blur-3xl" />
        <div className="relative grid h-full grid-cols-[1fr_auto] gap-3">
          <div className="space-y-2.5">
            {[
              ["payments-core", "24 merged contributions"],
              ["Algorithms", "Assessment · 91st percentile"],
              ["platform-api", "Maintainer · 18 months"],
            ].map(([title, detail], index) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.035] px-3 py-2.5"
              >
                <span className="font-mono text-[10px] text-electric-soft/60">0{index + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-medium text-stellar">{title}</span>
                  <span className="mt-0.5 block truncate font-mono text-[9px] text-nebula/70">{detail}</span>
                </span>
                <BadgeCheck size={14} className="shrink-0 text-electric-soft" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="hidden w-20 flex-col items-center justify-center gap-2 rounded-lg border border-electric/10 bg-electric/[0.04] sm:flex">
            <span className="h-10 w-10 rounded-full border border-electric/20 bg-[radial-gradient(circle,rgba(14,165,233,0.34),rgba(14,165,233,0.02)_70%)] shadow-[0_0_28px_rgba(14,165,233,0.14)]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-electric-soft/70">verified</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    icon: Orbit,
    title: "Understand capability",
    description:
      "Evidence becomes structured capability signals, with confidence attached to every skill.",
    className: "md:col-span-2",
    visual: (
      <div className="relative flex h-full min-h-24 items-center justify-between overflow-hidden rounded-xl border border-white/[0.07] bg-[#07111a]/80 px-5 py-4">
        <div className="absolute -left-8 -top-14 h-32 w-32 rounded-full bg-electric/10 blur-2xl" />
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-electric/20 bg-electric/[0.04] shadow-[0_0_35px_rgba(14,165,233,0.12)]">
          <span className="absolute inset-2 rounded-full border border-dashed border-electric/35" />
          <span className="absolute inset-5 rounded-full border border-electric/35" />
          <span className="h-2.5 w-2.5 rounded-full bg-electric shadow-[0_0_16px_#0EA5E9]" />
        </div>
        <div className="relative flex max-w-[65%] flex-wrap justify-end gap-2">
          {["Python", "API design", "Systems", "Ownership"].map((skill) => (
            <span key={skill} className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[9px] text-nebula">
              {skill}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    number: "03",
    icon: Target,
    title: "Find the right match",
    description:
      "Compare verified skills, evidence strength and explained fit before the first call.",
    className: "md:col-span-1",
    visual: (
      <div className="relative flex h-full min-h-24 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-[#07111a]/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(14,165,233,0.16),transparent_65%)]" />
        <div className="relative flex items-baseline gap-2">
          <span className="font-mono text-4xl font-semibold tracking-tight text-stellar">94</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-electric-soft">match</span>
        </div>
      </div>
    ),
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Hire with confidence",
    description:
      "Trace every important signal back to its evidence, all the way to the decision.",
    className: "md:col-span-1",
    visual: (
      <div className="relative flex h-full min-h-24 flex-col justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.07] bg-[#07111a]/80 px-4">
        {[
          "Repository verified",
          "Assessment attached",
          "Decision trace ready",
        ].map((item, index) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-electric/25 bg-electric/10 font-mono text-[8px] text-electric-soft">{index + 1}</span>
            <span className="text-[10px] text-nebula">{item}</span>
            <span className="ml-auto h-px flex-1 bg-gradient-to-r from-electric/25 to-transparent" />
          </div>
        ))}
      </div>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24" aria-labelledby="how-it-works-title">
      <Container>
        <Reveal>
          <p className="font-mono text-micro uppercase tracking-caps text-electric-soft">How it works</p>
          <h2
            id="how-it-works-title"
            className="mt-3 max-w-xl font-display text-[2.5rem] leading-[1.05] tracking-tight text-stellar sm:text-[3.25rem]"
          >
            From evidence to hire, in four steps.
          </h2>
        </Reveal>

        <ol className="mt-10 list-none p-0">
          <BentoGrid className="md:auto-rows-[15rem]">
            {steps.map(({ number, icon: Icon, title, description, className, visual }, index) => (
              <Reveal key={number} delay={index * 80} as="li" className={`list-none ${className}`}>
                <BentoGridItem
                  className="h-full"
                  title={title}
                  description={description}
                  icon={<Icon size={17} className="text-electric-soft" aria-hidden="true" />}
                  header={visual}
                />
              </Reveal>
            ))}
          </BentoGrid>
        </ol>
      </Container>
    </section>
  );
}
