import { ArrowUpRight } from "lucide-react";
import Reveal from "./Reveal";
import Container from "../ui/Container";
import Button from "../ui/Button";

const pathways = [
  {
    eyebrow: "For candidates",
    statement: "Turn your work into proof.",
    copy: "Connect repositories and assessments once. Share a capability profile that speaks louder than any bullet point — you control what's visible.",
    cta: "Create your proof profile",
    to: "/signup",
  },
  {
    eyebrow: "For recruiters",
    statement: "Search demonstrated capability.",
    copy: "Move past keyword matching. Compare candidates on verified skills, evidence strength and explained fit before the first call.",
    cta: "Join as a recruiter",
    to: "/signup",
  },
];

export default function Pathways() {
  return (
    <section id="pathways" className="scroll-mt-24" aria-label="Choose your pathway">
      <Container>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {pathways.map(({ eyebrow, statement, copy, cta, to }, i) => (
            <Reveal key={eyebrow} delay={i * 100}>
              <div className="landing-feature-card flex h-full flex-col items-start rounded-2xl px-7 py-10 sm:px-10">
                <p className="font-mono text-micro uppercase tracking-caps text-electric-soft">
                  {eyebrow}
                </p>
                <h3 className="mt-3 max-w-sm font-display text-[2.35rem] leading-[1.06] tracking-tight text-stellar">
                  {statement}
                </h3>
                <p className="mt-4 max-w-md text-body-sm leading-relaxed text-nebula">{copy}</p>
                <div className="mt-auto pt-8">
                  <Button
                    variant="outline"
                    to={to}
                    trailingIcon={ArrowUpRight}
                    className="hero-secondary rounded-full"
                  >
                    {cta}
                  </Button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
