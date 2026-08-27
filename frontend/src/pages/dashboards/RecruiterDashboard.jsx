import { Link } from "react-router-dom";
import { Search, Briefcase, Users, ShieldCheck, CircleAlert, Target, ArrowRight } from "lucide-react";
import PageHeader from "../../components/ui/PageHeader";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import MetricTile from "../../components/intel/MetricTile";
import Timeline from "../../components/intel/Timeline";
import { CompareBars } from "../../components/charts/Charts";
import DataSourceBadge, { DemoDataBanner } from "../../components/intel/DataSourceBadge";
import { useDomainData } from "../../hooks/useDomainData";
import { DEMO_CANDIDATES, DEMO_MATCHES, DEMO_JOBS, DEMO_EVIDENCE, DEMO_APPLICATIONS, DEMO_ANALYTICS, DEMO_ADMIN_STATS } from "../../demo/demoData";

/**
 * Recruiter command center — what needs review, where the strongest fits are,
 * and where evidence confidence is thin.
 */
export default function RecruiterDashboard() {
  const q = useDomainData(["recruiter", "dashboard"], async () => null, "ok");
  const analyticsQ = useDomainData(["analytics", "summary"], async () => null, DEMO_ANALYTICS);

  const strongMatches = [...DEMO_MATCHES].filter((m) => m.score >= 80).sort((a, b) => b.score - a.score).slice(0, 3);
  const needsReview = DEMO_APPLICATIONS.filter((a) => a.stage === "screening");
  const openJobs = DEMO_JOBS.filter((j) => j.status === "open");
  const weakEvidence = DEMO_CANDIDATES.filter((c) => c.evidenceStrength !== "strong").slice(0, 3);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Recruiter overview"
        title="Command center"
        description="Strongest matches require review. Evidence gaps reveal where to nudge candidates."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button to="/candidates/search" leadingIcon={<Search size={15} />}>Search candidates</Button>
          </>
        }
      />

      {q.isDemo && <DemoDataBanner />}

      <section aria-label="Key signals" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          question="How many applications are awaiting screening?"
          value={needsReview.length}
          context={`${needsReview.length} applicant${needsReview.length === 1 ? "" : "s"} at screening gate — oldest is ${needsReview[0] ? new Date(needsReview[0].updatedAt).toLocaleDateString() : "—"}`}
          icon={Users}
          tone={needsReview.length > 0 ? "caution" : "verified"}
        />
        <MetricTile
          question="Where are the strongest verified fits right now?"
          value={strongMatches.length}
          context={strongMatches[0] ? `${DEMO_CANDIDATES.find((c) => c.id === strongMatches[0].candidateId)?.name || "—"} at ${strongMatches[0].score}% for ${DEMO_JOBS.find((j) => j.id === strongMatches[0].jobId)?.ref}` : "no strong matches yet"}
          icon={Target}
          tone="verified"
        />
        <MetricTile
          question="How open is the evidence confidence picture?"
          value={`${Math.round(analyticsQ.data?.evidenceQuality?.[analyticsQ.data.evidenceQuality.length - 1]?.avgConfidence || 0)}% avg`}
          context={`${(analyticsQ.data?.evidenceQuality?.[analyticsQ.data.evidenceQuality.length - 1]?.verifiedShare || 0)}% of items verified — rising trend over 8 weeks`}
          icon={ShieldCheck}
        />
        <MetricTile
          question="Which requirement buckets are hardest to fill?"
          value="Accessibility · Security"
          context="Lowest candidate-to-requisition supply ratio — consider sourcing pass"
          icon={CircleAlert}
          tone="caution"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Strong matches ranked */}
          <Card>
            <Card.Header className="flex-row items-center justify-between">
              <Card.Title>Strongest verified matches</Card.Title>
              <Link to="/matches" className="flex items-center gap-1.5 rounded text-meta font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none">
                All <ArrowRight size={12} />
              </Link>
            </Card.Header>
            <Card.Content className="p-2">
              <ul role="list" className="divide-y divide-line-subtle/60">
                {strongMatches.map((m) => {
                  const candidate = DEMO_CANDIDATES.find((c) => c.id === m.candidateId);
                  const job = DEMO_JOBS.find((j) => j.id === m.jobId);
                  return (
                    <li key={`${m.jobId}-${m.candidateId}`} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
                      <div className="min-w-0">
                        <Link to={`/candidates/${m.candidateId}/match/${m.jobId}`} className="truncate text-body-sm font-medium text-ink-hi transition-colors hover:text-intel focus-visible:outline-none">
                          {candidate?.name}
                        </Link>
                        <p className="numeric mt-0.5 text-micro text-ink-faint">{job?.ref} · {job?.title}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="numeric font-mono text-section font-semibold text-verified">{m.score}%</span>
                        <Badge tone={m.stage === "offer" ? "success" : "info"} size="sm" dot>{m.stage}</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card.Content>
          </Card>

          {/* Supply/demand — chart answering "where are we exposed?" */}
          <Card>
            <Card.Header><Card.Title>Skill supply vs demand</Card.Title></Card.Header>
            <Card.Content>
              <CompareBars
                data={analyticsQ.data?.skillDemand || []}
                question="Which capability markets have the worst supply gap?"
              />
            </Card.Content>
          </Card>
        </div>

        <aside className="flex flex-col gap-6">
          {/* Open roles */}
          <Card>
            <Card.Header className="flex-row items-center justify-between">
              <Card.Title>Open roles</Card.Title>
              <Link to="/jobs" className="flex items-center gap-1.5 rounded text-meta font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none">
                All <ArrowRight size={12} />
              </Link>
            </Card.Header>
            <Card.Content className="p-2">
              <ul role="list" className="divide-y divide-line-subtle/60">
                {openJobs.map((job) => (
                  <li key={job.id} className="px-4 py-3.5">
                    <Link to={`/jobs/${job.id}`} className="block text-body-sm font-medium text-ink-hi transition-colors hover:text-intel focus-visible:outline-none">{job.title}</Link>
                    <p className="numeric mt-0.5 text-micro text-ink-faint">{job.ref} · {job.location} · {job.applicantsCount} applicants</p>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          {/* Candidates with thin evidence */}
          <Card>
            <Card.Header><Card.Title>Candidates with thin evidence</Card.Title></Card.Header>
            <Card.Content>
              <p className="mb-3 text-meta text-ink-muted">These profiles claim skills but lack sufficient verification — a targeted assessment request would help them and you.</p>
              <ul role="list" className="flex flex-col divide-y divide-line-subtle/60">
                {weakEvidence.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <Link to={`/candidates/${c.id}`} className="min-w-0 truncate text-body-sm font-medium text-ink-hi transition-colors hover:text-intel focus-visible:outline-none">
                      {c.name}
                    </Link>
                    <Badge tone={c.evidenceStrength === "moderate" ? "warning" : "neutral"} size="sm" dot>{c.evidenceStrength} evidence</Badge>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          {/* Activity */}
          <Card>
            <Card.Header><Card.Title>Recent</Card.Title></Card.Header>
            <Card.Content>
              <Timeline
                items={[
                  { id: "r-1", kind: "stage_change", title: "Application advanced", detail: "Jordan Reyes moved to screening for REQ-301", at: "2026-08-24T09:30:00Z" },
                  { id: "r-2", kind: "profile_view", title: "Profile viewed", detail: "You inspected Hana Suzuki's accessibility evidence", at: "2026-08-25T08:00:00Z" },
                  { id: "r-3", kind: "match_received", title: "Match refreshed", detail: "REQ-304 ranking updated — Ferreira still #1", at: "2026-08-20T12:00:00Z" },
                ]}
              />
            </Card.Content>
          </Card>
        </aside>
      </div>
    </div>
  );
}
