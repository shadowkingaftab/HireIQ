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
    <section aria-label="What ORIONET stands for">
      <Container>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {principles.map(({ icon: Icon, title, copy }) => (
            <li
              key={title}
              className="group flex items-start gap-3.5"
              style={{
                background: "rgba(255,255,255,0.10)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.28)",
                borderRadius: 16,
                padding: 18,
              }}
            >
              <span
                className="feature-icon mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: "rgba(252,115,77,0.18)",
                  border: "1px solid rgba(252,115,77,0.45)",
                  color: "#FFB27A",
                }}
              >
                <Icon size={17} aria-hidden="true" />
              </span>
              <div>
                <p className="font-sans" style={{ color: "#FFFFFF", fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>{title}</p>
                <p className="mt-1 font-sans" style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.5 }}>{copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

