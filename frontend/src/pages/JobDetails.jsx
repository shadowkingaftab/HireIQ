import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, BarChart3, Briefcase } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import ProofGraph from "../components/graph/ProofGraph";
import MatchBreakdown from "../components/matching/MatchBreakdown";
import Timeline from "../components/intel/Timeline";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { jobApi } from "../services/jobApi";
import {
  DEMO_JOBS,
  DEMO_MATCHES,
  DEMO_CANDIDATES,
  DEMO_EVIDENCE,
  DEMO_APPLICATIONS,
} from "../demo/demoData";
import { formatDate } from "../utils/formatters";

const statusTone = { open: "success", draft: "neutral", paused: "warning", closed: "danger" };

/**
 * Job detail — overview, requirements graph, applicants ranked and matched.
 * Answers "what's the shape of this role and who's the best fit?"
 */
export default function JobDetails() {
  const { jobId } = useParams();
  const jobIdNum = Number(jobId);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [tab, setTab] = useState("overview");

  const jobQ = useDomainData(["job", jobId], () => jobApi.get(jobIdNum), DEMO_JOBS.find((j) => j.id === jobIdNum));
  const job = jobQ.data;

  const matches = DEMO_MATCHES.filter((m) => m.jobId === jobIdNum).sort((a, b) => b.score - a.score);
  const appIds = DEMO_APPLICATIONS.filter((a) => a.jobId === jobIdNum).map((a) => a.candidateId);

  if (!job) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Job not found" />
      </div>
    );
  }

  const selectedCandidate = selectedCandidateId ? DEMO_CANDIDATES.find((c) => c.id === selectedCandidateId) : null;
  const selectedMatch = selectedCandidateId ? matches.find((m) => m.candidateId === selectedCandidateId) : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link to="/jobs" className="mb-4 inline-flex items-center gap-1.5 rounded text-meta font-medium text-ink-muted transition-colors hover:text-intel focus-visible:outline-none">
          <ArrowLeft size={14} aria-hidden="true" /> Jobs
        </Link>
        <PageHeader
          eyebrow={job.ref}
          title={job.title}
          description={`${job.location} · ${job.employment} · salary ${job.currency || "€"}${job.salary_min?.toLocaleString() || "—"}–${job.salary_max?.toLocaleString() || "—"}`}
          actions={
            <>
              <DataSourceBadge source={jobQ.source} />
              <Badge tone={statusTone[job.status] || "neutral"} size="md" dot>{job.status}</Badge>
              <Button variant="secondary" size="sm" to="/jobs/new">Clone as new</Button>
            </>
          }
        />
      </div>

      {(jobQ.isDemo) && <DemoDataBanner />}

      <Tabs
        value={tab}
        onChange={setTab}
        items={[
          { value: "overview", label: "Overview", icon: Briefcase },
          { value: "applicants", label: `Applicants (${matches.length})`, icon: Users },
          { value: "graph", label: "Requirements graph", icon: BarChart3 },
        ]}
        className="overflow-x-auto"
      />

      <TabPanel value="overview" defaultValue="overview">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_24rem]">
          <Card>
            <Card.Header><Card.Title>Role description</Card.Title></Card.Header>
            <Card.Content>
              <p className="text-body leading-relaxed text-ink-muted whitespace-pre-wrap">{job.description}</p>
            </Card.Content>
          </Card>

          <div className="flex flex-col gap-5">
            <Card>
              <Card.Header><Card.Title>Requirement profile</Card.Title></Card.Header>
              <Card.Content className="p-2">
                <ul role="list" className="divide-y divide-line-subtle/60">
                  {job.requirementProfile.map((r) => (
                    <li key={r.skill} className="flex items-center justify-between gap-3 px-4 py-3">
                      <span className="truncate text-body-sm text-ink-hi">{r.skill}</span>
                      <span className="numeric font-mono text-micro text-ink-faint">
                        ×{r.weight.toFixed(2)} · min {r.minConfidence}%
                      </span>
                    </li>
                  ))}
                </ul>
              </Card.Content>
            </Card>

            <Card>
              <Card.Header><Card.Title>Published</Card.Title></Card.Header>
              <Card.Content>
                <p className="text-meta text-ink-muted">
                  {formatDate(job.createdAt)} · {job.applicantsCount} applicants to date
                </p>
              </Card.Content>
            </Card>
          </div>
        </div>
      </TabPanel>

      <TabPanel value="applicants" defaultValue="overview">
        <p className="mb-4 text-body-sm text-ink-muted">
          Ranked by match score — select a candidate to see their full match reasoning inline.
        </p>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,22rem)_1fr]">
          <Card className="h-fit">
            <Card.Header><Card.Title>Candidates</Card.Title></Card.Header>
            <Card.Content className="p-2">
              {!matches.length ? (
                <p className="p-4 text-body-sm text-ink-muted">No matches generated yet.</p>
              ) : (
                <ul role="list" className="divide-y divide-line-subtle/60">
                  {matches.map((m) => {
                    const c = DEMO_CANDIDATES.find((ca) => ca.id === m.candidateId);
                    return (
                      <li key={m.candidateId}>
                        <button
                          type="button"
                          onClick={() => setSelectedCandidateId(selectedCandidateId === m.candidateId ? null : m.candidateId)}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-2/60 focus-visible:outline-none ${
                            selectedCandidateId === m.candidateId ? "bg-intel-soft/30" : ""
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="truncate text-body-sm font-medium text-ink-hi">{c?.name}</p>
                            <p className="numeric text-micro text-ink-faint">rank #{m.rank} · {m.stage}</p>
                          </div>
                          <ScoreRing value={m.score} size={38} tone={m.score >= 80 ? "verified" : "intel"} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card.Content>
          </Card>

          {/* Inline match detail */}
          <div className="min-w-0">
            {selectedCandidate && selectedMatch ? (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-xl border border-intel/25 bg-intel-soft text-body-sm font-bold text-intel">{selectedCandidate.initials}</span>
                  <div>
                    <p className="text-section-sm text-ink-hi">{selectedCandidate.name}</p>
                    <p className="text-meta text-ink-muted">{selectedCandidate.headline}</p>
                  </div>
                </div>
                <Card>
                  <Card.Content>
                    <MatchBreakdown
                      match={selectedMatch}
                      evidence={DEMO_EVIDENCE.filter((e) => e.candidateId === selectedCandidate.id)}
                    />
                  </Card.Content>
                </Card>
                <ProofGraph
                  evidence={DEMO_EVIDENCE.filter((e) => e.candidateId === selectedCandidate.id)}
                  capabilities={selectedCandidate.capabilities}
                  job={job}
                  match={selectedMatch}
                />
              </div>
            ) : (
              <div className="flex h-full items-center justify-center rounded-panel border border-dashed border-line-subtle bg-surface-1/40 p-14 text-center">
                <p className="text-body-sm text-ink-muted">Select a candidate to see their match reasoning here.</p>
              </div>
            )}
          </div>
        </div>
      </TabPanel>

      <TabPanel value="graph" defaultValue="overview">
        <Card>
          <Card.Header><Card.Title>Requirement graph for this role</Card.Title></Card.Header>
          <Card.Content>
            <p className="mb-4 text-body-sm text-ink-muted">
              This graph shows the capability profile this role defines — proof-graph edges will light up as candidates with matching evidence are processed.
            </p>
            <ProofGraph
              evidence={DEMO_EVIDENCE.slice(0, 6)}
              capabilities={DEMO_CANDIDATES[0]?.capabilities}
              job={job}
              match={matches[0]}
            />
          </Card.Content>
        </Card>
      </TabPanel>
    </div>
  );
}
