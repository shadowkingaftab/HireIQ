import Reveal from "./Reveal";
import Container from "../ui/Container";

const steps = [
  {
    number: "01",
    title: "Build your proof",
    copy: "Connect the work that matters — repositories, assessments and contributions — and verify what's yours.",
  },
  {
    number: "02",
    title: "Understand capability",
    copy: "ProofHire turns evidence into structured capability signals, with confidence attached to every skill.",
  },
  {
    number: "03",
    title: "Find the right match",
    copy: "Recruiters search and compare candidates through explainable intelligence — not keyword bingo.",
  },
  {
    number: "04",
    title: "Hire with confidence",
    copy: "Every important signal can be traced back to its evidence, all the way to the decision.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24" aria-labelledby="how-it-works-title">
      <Container>
        <Reveal>
          <p className="text-micro font-medium uppercase tracking-caps text-intel">How it works</p>
          <h2
            id="how-it-works-title"
            className="mt-2 max-w-xl text-page-sm text-ink-hi"
          >
            From evidence to hire, in four steps.
          </h2>
        </Reveal>

        <ol className="mt-10 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ number, title, copy }, i) => (
            <Reveal key={number} delay={i * 90} as="li" className="list-none">
              <div className="landing-feature-card h-full rounded-card px-5 py-5">
                <span
                  aria-hidden="true"
                  className="numeric font-mono text-meta font-semibold text-intel"
                >
                  {number}
                </span>
                <h3 className="mt-2 text-section-sm text-ink-hi">{title}</h3>
                <p className="mt-1.5 text-body-sm leading-relaxed text-ink-muted">{copy}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
