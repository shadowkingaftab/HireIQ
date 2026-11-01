import { ShieldCheck, ScanSearch, Target, Lock } from "lucide-react";
import Container from "../ui/Container";

const principles = [
  { icon: ShieldCheck, title: "Evidence-backed", copy: "Claims are checked against verifiable work." },
  { icon: ScanSearch, title: "Explainable matching", copy: "Every score shows exactly why it exists." },
  { icon: Target, title: "Capability-first", copy: "Skills are demonstrated, not self-reported." },
  { icon: Lock, title: "Candidate-controlled", copy: "People decide what evidence to share." },
];

/**
 * Conceptual trust statements — deliberately no invented logos, metrics,
 * or customers.
 */
export default function TrustStrip() {
  return (
    <section aria-label="What ProofHire stands for">
      <Container>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="landing-feature-card group flex items-start gap-3.5 rounded-2xl p-4"
            >
              <span className="feature-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                <Icon size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-stellar">{title}</p>
                <p className="mt-1 font-sans text-meta leading-relaxed text-nebula">{copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
