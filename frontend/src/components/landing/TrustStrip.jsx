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
        <ul className="grid grid-cols-1 gap-x-8 gap-y-6 border-y border-line-subtle py-8 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map(({ icon: Icon, title, copy }) => (
            <li key={title} className="flex items-start gap-3.5">
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-subtle bg-surface-1 text-intel">
                <Icon size={16} aria-hidden="true" />
              </span>
              <div>
                <p className="text-body-sm font-semibold text-ink-hi">{title}</p>
                <p className="mt-0.5 text-meta font-sans leading-relaxed text-ink-muted">{copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
