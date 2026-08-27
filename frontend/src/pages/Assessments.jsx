import { ClipboardList, Play, CheckCircle2, Clock } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Progress, ScoreRing } from "../components/ui/Progress";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { assessmentApi } from "../services/assessmentApi";
import { DEMO_ASSESSMENTS } from "../demo/demoData";
import { formatDate } from "../utils/formatters";

const statusConfig = {
  completed: { tone: "success", label: "Completed" },
  in_progress: { tone: "info", label: "In progress" },
  pending: { tone: "warning", label: "Awaiting start" },
};

const kindLabels = {
  timed_quiz: "Timed · supervised",
  takehome: "Take-home",
  structured_interview: "Structured interview",
};

/** Assessment overview — what's assigned, in flight, and already banked. */
export default function Assessments() {
  const q = useDomainData(["assessments", "list"], () => assessmentApi.list(), DEMO_ASSESSMENTS);
  const assessments = q.data || [];
  const completed = assessments.filter((a) => a.status === "completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((acc, a) => acc + a.attempt.score, 0) / completed.length)
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Signal generation"
        title="Assessments"
        description="Supervised exercises that convert claimed skills into scored evidence — each result feeds your capability graph directly."
        actions={<DataSourceBadge source={q.source} />}
      />

      {q.isDemo && <DemoDataBanner />}

      {/* Summary strip */}
      <section aria-label="Assessment standing" className="panel flex flex-wrap items-center gap-8 p-5">
        <div className="flex items-center gap-4">
          <ScoreRing
            value={avgScore ?? 0}
            size={64}
            tone={avgScore >= 75 ? "verified" : "intel"}
            label="avg score"
          />
          <div>
            <p className="text-body-sm font-medium text-ink-hi">Across {completed.length} completed</p>
            <p className="text-meta text-ink-muted">results are percentile-ranked against the cohort</p>
          </div>
        </div>
        <div className="hidden h-10 w-px bg-line-subtle sm:block" aria-hidden="true" />
        <p className="text-meta text-ink-muted">
          <span className="font-medium text-ink-hi">Why they matter:</span> assessment signals are the fastest way to add
          verified capability where public code can't speak for you.
        </p>
      </section>

      {/* Assessment cards */}
      <div className="flex flex-col gap-4">
        {assessments.map((a) => {
          const status = statusConfig[a.status] || statusConfig.pending;
          return (
            <Card key={a.id} className="animate-fade-up">
              <Card.Content className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-section-sm text-ink-hi">{a.title}</h3>
                    <Badge tone={status.tone} size="sm" dot>{status.label}</Badge>
                  </div>
                  <p className="numeric mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-mono text-micro text-ink-faint">
                    <span>{a.id}</span>
                    <span>{kindLabels[a.kind]}</span>
                    <span>· {a.questionCount} tasks</span>
                    <span>· {a.durationMin} min budget</span>
                    {a.completedAt && <span>· done {formatDate(a.completedAt)}</span>}
                  </p>
                  <ul role="list" aria-label="Skills assessed" className="mt-2.5 flex flex-wrap gap-1.5">
                    {a.skills.map((s) => (
                      <li key={s} className="rounded border border-line-subtle bg-surface-2/60 px-1.5 py-0.5 text-micro text-ink-muted">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status-specific right side */}
                {a.status === "completed" && a.attempt && (
                  <div className="flex shrink-0 items-center gap-6">
                    <div>
                      <ScoreRing value={a.attempt.score} size={56} tone="verified" />
                      <p className="numeric mt-1 text-center font-mono text-micro text-ink-faint">
                        {a.attempt.percentile}th pctile
                      </p>
                    </div>
                    <Button variant="secondary" to={`/assessments/${a.id}/results`}>
                      View interpretation
                    </Button>
                  </div>
                )}
                {a.status === "in_progress" && (
                  <div className="w-full max-w-xs shrink-0">
                    <Progress value={a.progressPct} label={`${a.progressPct}% complete`} />
                    <Button className="mt-3 w-full" to={`/assessments/${a.id}/run`} leadingIcon={<Play size={14} />}>
                      Resume now
                    </Button>
                  </div>
                )}
                {a.status === "pending" && (
                  <div className="shrink-0">
                    <Button to={`/assessments/${a.id}/run`} leadingIcon={<Clock size={14} />}>
                      Begin
                    </Button>
                  </div>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </div>

      {!assessments.length && !q.isLoading && (
        <Card>
          <Card.Content className="py-14 text-center">
            <ClipboardList size={24} aria-hidden="true" className="mx-auto mb-3 text-ink-faint" />
            <p className="text-body-sm text-ink-muted">No assessments assigned yet.</p>
            <p className="mt-1 text-meta text-ink-faint">Recruiters or the platform will assign relevant ones based on your goals.</p>
          </Card.Content>
        </Card>
      )}

      {/* Completed results teaser */}
      {completed.length > 0 && (
        <section aria-label="What results generate" className="rounded-card border border-line-subtle bg-surface-1/50 p-5">
          <h2 className="text-micro font-medium uppercase tracking-caps text-intel">What completing an assessment generates</h2>
          <ul role="list" className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { icon: CheckCircle2, text: "A verified evidence artifact linked to your profile (e.g. EV-2042)" },
              { icon: ClipboardList, text: "Per-skill scores with uncertainty bands feeding capabilities" },
              { icon: Clock, text: "A percentile benchmark so recruiters see relative standing" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-2.5 rounded-lg border border-line-subtle bg-surface-1 px-3.5 py-3">
                <Icon size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-intel" />
                <span className="text-meta leading-snug text-ink-muted">{text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
