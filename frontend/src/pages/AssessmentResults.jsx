import { useParams, Link } from "react-router-dom";
import { ShieldCheck, TrendingUp } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import { useDomainData } from "../hooks/useDomainData";
import { assessmentApi } from "../services/assessmentApi";
import { DEMO_ASSESSMENTS, DEMO_CANDIDATES, DEMO_CURRENT_CANDIDATE_ID } from "../demo/demoData";

/**
 * Assessment results — interpretation, not just a number: per-skill signals
 * with uncertainty, percentile context, and the evidence artifact generated.
 */
export default function AssessmentResults() {
  const { assessmentId } = useParams();
  const q = useDomainData(
    ["assessment", assessmentId],
    () => assessmentApi.results(assessmentId),
    DEMO_ASSESSMENTS.find((a) => a.id === (assessmentId || "AS-501")) || DEMO_ASSESSMENTS[0]
  );
  const a = q.data;
  const attempt = a?.attempt;

  if (!attempt) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader eyebrow="Assessment" title="Results not available yet" />
        <Card>
          <Card.Content className="py-12 text-center">
            <p className="text-body-sm text-ink-muted">
              This assessment hasn't produced a scored attempt yet. Results appear here once the backend scoring service
              processes your session.
            </p>
            <Button variant="secondary" to="/assessments" className="mt-5">Back to assessments</Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={`Assessment · ${a.id}`}
        title={a.title}
        description={content_summary(a)}
        actions={
          <Button variant="secondary" to="/assessments">All assessments</Button>
        }
      />

      <section aria-label="Result summary" className="panel flex flex-col items-center gap-8 p-6 sm:flex-row sm:items-start">
        <div className="flex shrink-0 flex-col items-center">
          <ScoreRing value={attempt.score} size={104} tone={attempt.score >= 75 ? "verified" : "intel"} label="score" />
          <p className="numeric mt-2 font-mono text-micro text-ink-faint">
            {attempt.percentile}th percentile cohort
          </p>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <p className="text-body leading-relaxed text-ink-muted">{interpretation(a)}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {attempt.perSkill.map((s) => (
              <div key={s.skill} className="rounded-lg border border-line-subtle bg-surface-1/60 p-3.5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="truncate text-body-sm font-medium text-ink-hi">{s.skill}</span>
                  <Badge tone={s.score >= 85 ? "success" : s.score >= 70 ? "info" : "warning"} size="sm" mono>{s.score}</Badge>
                </div>
                <ConfidenceBar value={s.score} uncertainty={s.uncertainty} aria-label={`${s.skill} signal`} />
              </div>
            ))}
          </div>

          {/* Evidence linkage */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-verified/20 bg-verified-soft/25 px-3.5 py-3">
            <ShieldCheck size={15} aria-hidden="true" className="shrink-0 text-verified" />
            <p className="text-meta text-ink-med">
              This result generated verified evidence{" "}
              <Link to="/evidence" className="numeric rounded font-mono font-medium text-intel hover:text-intel-firm focus-visible:outline-none">
                {attempt.evidenceId}
              </Link>{" "}
              — now feeding the matching capability in your proof graph.
            </p>
          </div>
        </div>
      </section>

      <Card>
        <Card.Header><Card.Title>What this changes</Card.Title></Card.Header>
        <Card.Content>
          <ul role="list" className="flex flex-col gap-3">
            {[
              `Your ${a.skills[0]} capability gains a supervised, third-party signal that recruiters weight above self-reported claims.`,
              `Percentile standing (${attempt.percentile}th) gives matches relative context rather than raw scores alone.`,
              "Uncertainty on this skill drops with each additional corroborating artifact.",
            ].map((line) => (
              <li key={line} className="flex items-start gap-2.5">
                <TrendingUp size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-signal" />
                <span className="text-body-sm leading-relaxed text-ink-muted">{line}</span>
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}

function content_summary(a) {
  return `Completed ${a.completedAt ? new Date(a.completedAt).toLocaleDateString() : ""} · ${a.attempt.durationUsedMin} of ${a.durationMin} minutes used · ${a.kind.replace("_", " ")}`;
}

function interpretation(a) {
  const pct = a.attempt.percentile;
  if (pct >= 90)
    return "Top-decile performance under timed, supervised conditions. The strongest kind of signal an assessment can generate — it independently confirms skills that might otherwise rest on self-reported experience.";
  if (pct >= 70)
    return "Strong performance under supervision. Confirms working depth in the assessed skills and adds meaningful confidence to related capabilities.";
  return "Completed successfully. The result adds a verified baseline signal; repeating after targeted practice would tighten uncertainty further.";
}
