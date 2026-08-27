import { FileBarChart, BarChart3, Download, Calendar, Mail } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import { DistributionBarChart } from "../components/charts/Charts";
import Timeline from "../components/intel/Timeline";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { DEMO_ANALYTICS, DEMO_CANDIDATES, DEMO_JOBS, DEMO_MATCHES, DEMO_ADMIN_STATS } from "../demo/demoData";

/**
 * Reports — pre-built intelligence views. Each answers one
 * hiring-leadership question.
 */
const reportCards = [
  {
    id: "top-matches",
    title: "Top matches this week",
    question: "Who should we talk to right now?",
    render: () => {
      const top = [...DEMO_MATCHES].sort((a, b) => b.score - a.score).slice(0, 5);
      return (
        <ul role="list" className="divide-y divide-line-subtle/60">
          {top.map((m) => {
            const c = DEMO_CANDIDATES.find((ca) => ca.id === m.candidateId);
            const job = DEMO_JOBS.find((j) => j.id === m.jobId);
            return (
              <li key={`${m.jobId}-${m.candidateId}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3.5 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="truncate text-body-sm font-medium text-ink-hi">{c?.name}</p>
                  <p className="numeric mt-0.5 text-micro text-ink-faint">{job?.ref} · {job?.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <ScoreRing value={m.score} size={36} tone={m.score >= 80 ? "verified" : "intel"} />
                  <ConfidenceBar value={100 - m.uncertainty} uncertainty={m.uncertainty} className="w-24" />
                </div>
              </li>
            );
          })}
        </ul>
      );
    },
  },
  {
    id: "evidence-health",
    title: "Evidence health",
    question: "What's our verification coverage?",
    render: () => (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line-subtle bg-surface-1/60 p-3.5">
          <p className="text-micro uppercase tracking-caps text-ink-faint">Strong evidence share</p>
          <p className="numeric mt-1 font-mono text-section font-semibold text-verified">62%</p>
          <p className="mt-0.5 text-meta text-ink-muted">target: 70%+</p>
        </div>
        <div className="rounded-lg border border-line-subtle bg-surface-1/60 p-3.5">
          <p className="text-micro uppercase tracking-caps text-ink-faint">Unverified claims</p>
          <p className="numeric mt-1 font-mono text-section font-semibold text-caution">14%</p>
          <p className="mt-0.5 text-meta text-ink-muted">self-reported roles without endorsement</p>
        </div>
        <div className="rounded-lg border border-line-subtle bg-surface-1/60 p-3.5">
          <p className="text-micro uppercase tracking-caps text-ink-faint">Assessment completions</p>
          <p className="numeric mt-1 font-mono text-section font-semibold text-intel">58</p>
          <p className="mt-0.5 text-meta text-ink-muted">across all roles, 8-week window</p>
        </div>
      </div>
    ),
  },
  {
    id: "profile-quality",
    title: "Profile quality distribution",
    question: "How strong is our candidate pool overall?",
    render: () => (
      <DistributionBarChart
        data={DEMO_CANDIDATES.map((c) => ({
          bucket: c.evidenceStrength,
          count: DEMO_CANDIDATES.filter((ca) => ca.evidenceStrength === c.evidenceStrength).length,
        })).filter(
          (item, index, self) => index === self.findIndex((t) => t.bucket === item.bucket)
        )}
        xKey="bucket"
        tone="verified"
        question="How is our talent pool distributed by evidence strength?"
      />
    ),
  },
  {
    id: "system-health",
    title: "System health",
    question: "Is the hiring platform operational?",
    render: () => (
      <div className="flex flex-col gap-2.5">
        {Object.entries(DEMO_ADMIN_STATS.systemHealth).map(([service, status]) => (
          <div key={service} className="flex items-center justify-between gap-3 rounded-lg border border-line-subtle bg-surface-1/60 px-3.5 py-3">
            <span className="capitalize text-body-sm text-ink-hi">{service.replace(/([A-Z])/g, " $1").trim()}</span>
            <Badge tone={status === "operational" ? "success" : "caution"} size="sm" dot>{status}</Badge>
          </div>
        ))}
      </div>
    ),
  },
];

/** Reports — each answers one hiring leadership question. */
export default function Reports() {
  const q = useDomainData(["reports", "list"], async () => [], null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Intelligence views"
        title="Reports"
        description="Each report answers one question. If the answer isn't useful, the report isn't worth the space."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button variant="secondary" leadingIcon={<Download size={15} />}>Export</Button>
            <Button variant="secondary" leadingIcon={<Calendar size={15} />}>Schedule</Button>
            <Button variant="secondary" leadingIcon={<Mail size={15} />}>Send</Button>
          </>
        }
      />

      {q.isDemo && <DemoDataBanner />}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {reportCards.map((report) => (
          <Card key={report.id} className="animate-fade-up">
            <Card.Header className="flex-row items-center justify-between">
              <Card.Title>{report.title}</Card.Title>
              <Badge tone="info" size="sm" mono>{report.id}</Badge>
            </Card.Header>
            <Card.Content>
              <p className="mb-3 text-meta text-ink-muted">{report.question}</p>
              {report.render()}
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
