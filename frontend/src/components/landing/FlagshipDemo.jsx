import { useState } from "react";
import { GitBranch, ClipboardCheck, ArrowRight, FileSearch } from "lucide-react";
import Reveal from "./Reveal";
import Container from "../ui/Container";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "../ui/Card";
import Badge from "../ui/Badge";
import { ScoreRing, ConfidenceBar } from "../ui/Progress";
import Button from "../ui/Button";

const EVIDENCE = [
  {
    id: "repo",
    icon: GitBranch,
    title: "payments-core",
    meta: "42 repositories · merged PRs · reviews",
    tone: "strong",
    skills: ["Python", "FastAPI", "Docker"],
  },
  {
    id: "assessment",
    icon: ClipboardCheck,
    title: "Algorithms assessment",
    meta: "Scored in top band · timed · proctored",
    tone: "strong",
    skills: ["Python", "SQL"],
  },
  {
    id: "history",
    icon: FileSearch,
    title: "Consistent activity",
    meta: "Substantial contributions across 24 months",
    tone: "moderate",
    skills: ["FastAPI", "PostgreSQL"],
  },
];

const SKILLS = {
  Python: { depth: 92, evidence: "42 repositories · assessment" },
  FastAPI: { depth: 88, evidence: "Production services · API design" },
  PostgreSQL: { depth: 81, evidence: "Schema design · query optimization" },
  Docker: { depth: 76, evidence: "Deployment pipelines" },
};

const BREAKDOWN = [
  { label: "API architecture", value: 92 },
  { label: "Python depth", value: 88 },
  { label: "Data modeling", value: 84 },
  { label: "Systems operations", value: 77 },
];

/**
 * Flagship demonstration: evidence → verified skills → match → explanation.
 * Content is clearly demonstrative; the interaction (selecting an evidence
 * source highlights the skills it supports) communicates provenance.
 */
export default function FlagshipDemo() {
  const [selected, setSelected] = useState("repo");
  const active = EVIDENCE.find((e) => e.id === selected);

  return (
    <section id="intelligence" className="scroll-mt-24" aria-labelledby="intelligence-title">
      <Container>
        <Reveal>
          <p className="text-micro font-medium uppercase tracking-caps text-intel">The intelligence layer</p>
          <h2 id="intelligence-title" className="mt-2 max-w-2xl text-page-sm text-ink-hi">
            Evidence becomes a score you can interrogate.
          </h2>
          <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink-muted">
            Select an evidence source and watch the capability signal it powers. Nothing is a black
            box — every number keeps its receipts.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Evidence → skills */}
          <Reveal delay={80} className="lg:col-span-3">
            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Candidate evidence</CardTitle>
                <CardDescription>Demonstration profile — backend engineer</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {EVIDENCE.map(({ id, icon: Icon, title, meta, tone }) => {
                  const isActive = id === selected;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelected(id)}
                      aria-pressed={isActive}
                      className={`flex w-full items-center gap-3.5 rounded-lg border px-4 py-3.5 text-left transition-colors duration-150 focus-visible:outline-none ${
                        isActive
                          ? "border-intel/40 bg-intel-soft"
                          : "border-line-subtle bg-surface-1 hover:border-line-strong hover:bg-surface-2/60"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                          isActive ? "border-intel/30 bg-surface-1 text-intel" : "border-line-subtle bg-surface-2 text-ink-faint"
                        }`}
                      >
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`block truncate text-body-sm font-medium ${isActive ? "text-ink-hi" : "text-ink-med"}`}>
                          {title}
                        </span>
                        <span className="block truncate font-mono text-micro text-ink-faint">{meta}</span>
                      </span>
                      <Badge tone={tone} dot>{tone}</Badge>
                    </button>
                  );
                })}

                <div className="mt-2 border-t border-line-subtle pt-4">
                  <p className="text-micro font-medium uppercase tracking-caps text-ink-faint">
                    Verified skills supported by this evidence
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {Object.entries(SKILLS).map(([skill, info]) => {
                      const powered = active.skills.includes(skill);
                      return (
                        <span
                          key={skill}
                          className={`inline-flex items-baseline gap-2 rounded-full border px-3 py-1.5 transition-opacity duration-200 ${
                            powered ? "border-intel/35 bg-intel-soft opacity-100" : "border-line-subtle bg-surface-1 opacity-40"
                          }`}
                          title={info.evidence}
                        >
                          <span className="font-mono text-meta font-medium text-ink-hi">{skill}</span>
                          <span className="numeric font-mono text-micro text-intel">{powered ? info.depth : "—"}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          {/* Match + explanation */}
          <Reveal delay={160} className="lg:col-span-2">
            <Card variant="interactive" className="edge-highlight h-full">
              <CardContent className="flex h-full flex-col">
                <div className="flex items-center gap-5">
                  <ScoreRing value={94} size={88} label="Match" />
                  <div>
                    <p className="text-section-sm text-ink-hi">Senior Backend Engineer</p>
                    <p className="mt-1 text-meta font-sans text-ink-muted">Demonstration role requirement</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  {BREAKDOWN.map(({ label, value }) => (
                    <div key={label}>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-body-sm text-ink-med">{label}</span>
                        <span className="numeric font-mono text-micro text-ink-hi">{value}</span>
                      </div>
                      <div className="h-1 w-full overflow-hidden rounded-full bg-surface-3">
                        <div className="h-full rounded-full bg-intel transition-[width] duration-500 ease-out" style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-6">
                  <ConfidenceBar value={89} uncertainty={5} label="Capability confidence" />
                  <p className="mt-4 rounded-lg border border-line-subtle bg-surface-2/60 px-3.5 py-3 text-meta font-sans leading-relaxed text-ink-muted">
                    Matched on verified backend capability with consistent long-term activity.
                    Uncertainty reflects limited production-scale evidence.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center text-micro text-ink-faint">
            <ArrowRight size={12} aria-hidden="true" />
            In the product, this panel links straight to the underlying repositories, assessments and history.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
