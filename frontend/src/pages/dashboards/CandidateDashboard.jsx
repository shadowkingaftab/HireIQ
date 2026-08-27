import { Link } from "react-router-dom";
import { GitBranch, ClipboardList, Target, ShieldCheck, ArrowRight, CircleAlert } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { ScoreRing, ConfidenceBar } from "../../components/ui/Progress";
import MetricTile from "../../components/intel/MetricTile";
import CapabilityMeterList from "../../components/intel/CapabilityMeterList";
import Timeline from "../../components/intel/Timeline";
import DataSourceBadge, { DemoDataBanner } from "../../components/intel/DataSourceBadge";
import { useDomainData } from "../../hooks/useDomainData";
import {
  DEMO_CANDIDATES,
  DEMO_EVIDENCE,
  DEMO_ASSESSMENTS,
  DEMO_JOBS,
  DEMO_MATCHES,
  DEMO_ACTIVITY,
  DEMO_CURRENT_CANDIDATE_ID,
} from "../../demo/demoData";

/**
 * Candidate command center. Every tile answers a question:
 *  - capability strength      → "how strong is my proof right now?"
 *  - evidence coverage        → "is my profile backed or just claimed?"
 *  - assessment progress      → "what's in flight?"
 *  - matches                  → "where am I wanted, and why?"
 *  - weakest capability       → "what single move raises me most?"
 */
export default function CandidateDashboard() {
  const me = useDomainData(
    ["candidate", "me"],
    async () => null,
    DEMO_CANDIDATES.find((c) => c.id === DEMO_CURRENT_CANDIDATE_ID)
  );
  const evidenceQ = useDomainData(["evidence", "me"], async () => [], DEMO_EVIDENCE.filter((e) => e.candidateId === me?.data?.id));
  const assessmentsQ = useDomainData(["assessments", "me"], async () => [], DEMO_ASSESSMENTS);
  const matchesQ = useDomainData(["matches", "me"], async () => [], DEMO_MATCHES.filter((m) => m.candidateId === DEMO_CURRENT_CANDIDATE_ID));
  const activityQ = useDomainData(["activity", "me"], async () => [], DEMO_ACTIVITY.slice(0, 5));

  const candidate = me.data;
  const isDemo = me.isDemo;
  const loading = me.isLoading;

  const weakest = candidate && [...candidate.capabilities].sort((a, b) => a.score - a.uncertainty / 2 - (b.score - b.uncertainty / 2))[0];
  const strongest = candidate && [...candidate.capabilities].sort((a, b) => b.score - a.score)[0];
  const verifiedCount = (evidenceQ.data || []).filter((e) => e.verified).length;
  const pendingAssessment = assessmentsQ.data?.find((a) => a.status === "in_progress" || a.status === "pending");
  const topMatch = matchesQ.data?.[0];
  const topMatchJob = topMatch ? DEMO_JOBS.find((j) => j.id === topMatch.jobId) : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Command center"
        title={`Welcome back${candidate ? `, ${candidate.name.split(" ")[0]}` : ""}`}
        description="Your proof graph at a glance — what's strong, what's claimed, and the next highest-leverage move."
        actions={
          <>
            <DataSourceBadge source={me.source} />
            <Button to="/profile" variant="secondary">Open proof graph</Button>
          </>
        }
      />

      {isDemo && <DemoDataBanner />}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="ph-skeleton h-28 rounded-panel" />
          ))}
        </div>
      ) : (
        <>
          {/* Meaningful metrics — each answers one question */}
          <section aria-label="Key signals" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricTile
              question="How strong is your strongest capability?"
              value={strongest ? `${strongest.score}%` : "—"}
              context={strongest ? `${strongest.name} · ±${strongest.uncertainty}% uncertainty · ${strongest.evidenceCount} evidence items` : undefined}
              icon={GitBranch}
              tone="intel"
            />
            <MetricTile
              question="Is your profile backed by verification?"
              value={`${verifiedCount}/${evidenceQ.data?.length ?? 0}`}
              context="evidence items independently verified — claims without verification count for little"
              icon={ShieldCheck}
              tone={verifiedCount > 3 ? "verified" : "caution"}
            />
            <MetricTile
              question="What's in flight?"
              value={assessmentsQ.data?.filter((a) => a.status !== "completed").length ?? 0}
              context={pendingAssessment ? `${pendingAssessment.title} · ${pendingAssessment.status.replace("_", " ")}` : "no open assessments"}
              icon={ClipboardList}
            />
            <MetricTile
              question="Where are you wanted?"
              value={topMatch ? `${topMatch.score}%` : "—"}
              context={topMatchJob ? `${topMatchJob.title} · rank #${topMatch.rank}` : "no active matches"}
              icon={Target}
              tone="verified"
            />
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_22rem]">
            {/* Left column */}
            <div className="flex min-w-0 flex-col gap-6">
              {/* Capability strength */}
              <Card>
                <Card.Header className="flex-row items-center justify-between">
                  <Card.Title>Capability strength</Card.Title>
                  <Button to="/capabilities" variant="ghost" size="sm" trailingIcon={<ArrowRight size={14} />}>
                    Inspect all
                  </Button>
                </Card.Header>
                <Card.Content>
                  <CapabilityMeterList capabilities={candidate?.capabilities || []} />
                </Card.Content>
              </Card>

              {/* Top match with why */}
              {topMatch && (
                <Card>
                  <Card.Header className="flex-row items-center justify-between">
                    <Card.Title>Your strongest match</Card.Title>
                    <Badge tone={topMatch.score >= 80 ? "success" : "info"} size="sm" dot>
                      rank #{topMatch.rank}
                    </Badge>
                  </Card.Header>
                  <Card.Content>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <ScoreRing value={topMatch.score} size={76} tone={topMatch.score >= 80 ? "verified" : "intel"} label="match" />
                      <div className="min-w-0 flex-1">
                        <p className="text-body-sm font-medium text-ink-hi">{topMatchJob?.title}</p>
                        <ConfidenceBar value={100 - topMatch.uncertainty} uncertainty={topMatch.uncertainty} className="mt-2 max-w-sm" />
                        <p className="mt-2 line-clamp-2 text-meta leading-relaxed text-ink-muted">{topMatch.explanation}</p>
                        <Button to={`/matches/${topMatch.jobId}`} size="sm" variant="secondary" className="mt-3">
                          See full breakdown
                        </Button>
                      </div>
                    </div>
                  </Card.Content>
                </Card>
              )}
            </div>

            {/* Right rail */}
            <aside className="flex flex-col gap-6">
              {/* Highest-leverage move */}
              {weakest && (
                <Card className="border-caution/25">
                  <Card.Header className="flex-row items-start justify-between">
                      <Card.Title>Highest-leverage move</Card.Title>
                    <CircleAlert size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-caution" />
                  </Card.Header>
                  <Card.Content>
                    <p className="text-body-sm leading-relaxed text-ink-muted">
                      <span className="font-medium text-ink-hi">{weakest.name}</span> sits at {weakest.score}% with ±{weakest.uncertainty}% uncertainty and only{" "}
                      {weakest.evidenceCount} evidence item{weakest.evidenceCount === 1 ? "" : "s"}. One targeted assessment here would tighten both score and confidence.
                    </p>
                    <Button size="sm" variant="secondary" className="mt-3 w-full" to="/assessments">
                      Find a matching assessment
                    </Button>
                  </Card.Content>
                </Card>
              )}

              {/* Recent activity */}
              <Card>
                <Card.Header className="flex-row items-center justify-between">
                  <Card.Title>Recent activity</Card.Title>
                  <Link to="/activity" className="rounded text-meta font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none">
                    All
                  </Link>
                </Card.Header>
                <Card.Content>
                  <Timeline items={activityQ.data || []} />
                </Card.Content>
              </Card>
            </aside>
          </div>
        </>
      )}

    </div>
  );
}
