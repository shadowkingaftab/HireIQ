import { GitBranch, Orbit, Target, BadgeCheck } from "lucide-react";
import Reveal from "./Reveal";
import Container from "../ui/Container";

const steps = [
  {
    number: "01",
    icon: GitBranch,
    title: "Build your proof",
    copy: "Connect the work that matters — repositories, assessments and contributions — and verify what's yours.",
  },
  {
    number: "02",
    icon: Orbit,
    title: "Understand capability",
    copy: "ProofHire turns evidence into structured capability signals, with confidence attached to every skill.",
  },
  {
    number: "03",
    icon: Target,
    title: "Find the right match",
    copy: "Recruiters search and compare candidates through explainable intelligence — not keyword bingo.",
  },
  {
    number: "04",
    icon: BadgeCheck,
    title: "Hire with confidence",
    copy: "Every important signal can be traced back to its evidence, all the way to the decision.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24" aria-labelledby="how-it-works-title">
      <Container>
        <Reveal>
          <p className="font-mono text-micro uppercase tracking-caps text-electric-soft">
            How it works
          </p>
          <h2
            id="how-it-works-title"
            className="mt-3 max-w-xl font-display text-[2.5rem] leading-[1.05] tracking-tight text-stellar sm:text-[3.25rem]"
          >
            From evidence to hire, in four steps.
          </h2>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, icon: Icon, title, copy }, i) => (
            <Reveal key={number} delay={i * 90} as="li" className="list-none">
              <div className="landing-feature-card h-full rounded-2xl px-5 py-6">
                <div className="flex items-center justify-between">
                  <span className="feature-icon flex h-10 w-10 items-center justify-center rounded-xl">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="numeric font-mono text-meta font-semibold tracking-widest text-electric-soft/70">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 text-section-sm text-stellar">{title}</h3>
                <p className="mt-2 text-body-sm leading-relaxed text-nebula">{copy}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
