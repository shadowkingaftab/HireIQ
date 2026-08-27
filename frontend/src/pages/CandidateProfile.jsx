import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, ClipboardList, GitBranch, Download, Share2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import { SkeletonCard } from "../components/ui/Skeleton";
import CapabilityMeterList from "../components/intel/CapabilityMeterList";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import ProofGraph from "../components/graph/ProofGraph";
import EvidenceCard from "../components/evidence/EvidenceCard";
import EvidenceDrawer from "../components/evidence/EvidenceDrawer";
import MatchBreakdown from "../components/matching/MatchBreakdown";
import ContributionHeatmap from "../components/candidate/ContributionHeatmap";
import ProjectExplorer from "../components/candidate/ProjectExplorer";

import { candidateApi } from "../services/candidateApi";
import { evidenceApi } from "../services/evidenceApi";
import { matchingApi } from "../services/matchingApi";
import { useDomainData } from "../hooks/useDomainData";
import {
  DEMO_CANDIDATES,
  DEMO_EVIDENCE,
  DEMO_JOBS,
  DEMO_MATCHES,
} from "../demo/demoData";
import { formatDate, formatRelativeTime } from "../utils/formatters";

/**
 * FLAGSHIP — the candidate proof graph.
 *
 * One page that answers: who is this person, what do they claim, what backs
 * it, how confident are we, and where does uncertainty remain. Recruiter
 * mode adds match context for a job.
 */
export default function CandidateProfile({ recruiterView = false, focus = null }) {
  const params = useParams();
  const candidateId = Number(params.candidateId) || null;

  const [inspectEvidence, setInspectEvidence] = useState(null);
  const [graphCapability, setGraphCapability] = useState(null);

  const candidateQ = useDomainData(
    ["candidate", candidateId ?? "me"],
    () => (candidateId ? candidateApi.get(candidateId) : Promise.reject(new Error("no id"))),
    candidateId
      ? DEMO_CANDIDATES.find((c) => c.id === candidateId)
      : DEMO_CANDIDATES[0]
  );
  const candidate = candidateQ.data;

  const evidenceQ = useDomainData(
    ["evidence", candidate?.id ?? "me"],
    () => evidenceApi.listForCandidate(candidate.id),
    DEMO_EVIDENCE.filter((ev) => ev.candidateId === candidate?.id)
  );
  const evidence = evidenceQ.data || [];

  // Recruiter view: which job's match context to show
  const jobId = recruiterView && focus === "match" ? Number(params.jobId) : null;
  const job = jobId ? DEMO_JOBS.find((j) => j.id === jobId) : DEMO_JOBS[0];
  const matchQ = useDomainData(
    ["match", candidate?.id, job?.id],
    () => matchingApi.forJob(job.id, { candidate_ids: [candidate.id] }),
    DEMO_MATCHES.find((m) => m.candidateId === candidate?.id && m.jobId === job?.id)
  );
  const match = matchQ.data;

  const verifiedShare = useMemo(() => {
    if (!evidence.length) return 0;
    return Math.round((evidence.filter((e) => e.verified).length / evidence.length) * 100);
  }, [evidence]);

  const graphEvidence = graphCapability
    ? evidence.filter((ev) =>
        ev.skills.some((s) => s.toLowerCase().includes(graphCapability.name.toLowerCase().split(" ")[0]))
      )
    : evidence;

  if (candidateQ.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <SkeletonCard />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={recruiterView ? "Candidate intelligence" : "Your proof graph"}
        title={candidate?.name}
        description={candidate?.summary}
        actions={
          <>
            <DataSourceBadge source={candidateQ.source} />
            {!recruiterView && (
              <>
                <Button variant="ghost" size="md" leadingIcon={<Share2 size={15} />}>
                  Share public profile
                </Button>
                <Button variant="secondary" size="md" leadingIcon={<Download size={15} />}>
                  Export dossier
                </Button>
              </>
            )}
          </>
        }
      />

      {candidateQ.isDemo && (
        <DemoDataBanner note="This profile is a synthetic persona rendered so the full intelligence surface can be evaluated." />
      )}

      {/* Identity + top-line signals */}
      <section aria-label="Profile summary" className="panel flex flex-col gap-6 p-6 lg:flex-row lg:items-start">
        <div className="flex items-center gap-4 lg:w-72">
          <span
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-intel/25 bg-intel-soft text-section font-semibold tracking-tight text-intel"
          >
            {candidate?.initials}
          </span>
          <div className="min-w-0">
            <h2 className="text-section-sm text-ink-hi">{candidate?.headline}</h2>
            <p className="mt-1 text-meta text-ink-muted">{candidate?.location}</p>
            <p className="numeric mt-1 text-micro text-ink-faint">
              active {formatRelativeTime(candidate?.lastActive)}
            </p>
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
          <div>
            <p className="text-micro uppercase tracking-caps text-ink-faint">Overall strength</p>
            <div className="mt-2 flex items-center gap-3">
              <ScoreRing
                value={
                  candidate?.capabilities?.length
                    ? Math.round(candidate.capabilities.reduce((acc, c) => acc + c.score, 0) / candidate.capabilities.length)
                    : 0
                }
                size={56}
                tone="intel"
              />
              <ConfidenceBar value={78} uncertainty={11} label="confidence" />
            </div>
          </div>
          <div>
            <p className="text-micro uppercase tracking-caps text-ink-faint">Verified evidence</p>
            <p className="numeric mt-2 font-mono text-section font-semibold text-verified">
              {verifiedShare}%
            </p>
            <p className="mt-0.5 text-meta text-ink-faint">{evidence.length} items · {candidate?.evidenceStrength} overall</p>
          </div>
          <div>
            <p className="text-micro uppercase tracking-caps text-ink-faint">Assessments</p>
            <p className="numeric mt-2 font-mono text-section font-semibold text-ink-hi">
              {candidate?.assessmentsCompleted}
            </p>
            <p className="mt-0.5 text-meta text-ink-faint">completed with supervision</p>
          </div>
          <div>
            <p className="text-micro uppercase tracking-caps text-ink-faint">Openness</p>
            <p className="mt-2"><Badge tone={candidate?.openness === "actively looking" ? "success" : "neutral"} dot>{candidate?.openness}</Badge></p>
            <p className="numeric mt-1.5 font-mono text-micro text-ink-faint">
              {candidate?.github_url ? `gh:${candidate.github_url.split("/")[1]}` : "no github linked"}
            </p>
          </div>
        </div>
      </section>

      {/* Proof graph */}
      <ProofGraph
        evidence={graphEvidence}
        capabilities={candidate?.capabilities}
        job={recruiterView ? job : undefined}
        match={recruiterView ? match : undefined}
        className="animate-fade-up"
      />

      {/* Detail tabs */}
      <Tabs
        defaultValue="capabilities"
        items={[
          { value: "capabilities", label: "Capabilities", icon: GitBranch },
          { value: "evidence", label: `Evidence (${evidence.length})`, icon: ShieldCheck },
          { value: "contributions", label: "Contributions", icon: ClipboardList },
          ...(recruiterView && match
            ? [{ value: "match", label: `Match — ${job.title}`, icon: Target }]
            : []),
        ]}
      />

      <TabPanel value="capabilities" defaultValue="capabilities">
        <Card>
          <Card.Content className="p-2">
            <CapabilityMeterList
              capabilities={candidate?.capabilities || []}
              onInspect={(cap) => setGraphCapability(cap)}
            />
          </Card.Content>
        </Card>
        {graphCapability && (
          <p className="mt-3 rounded-lg border border-intel/20 bg-intel-soft/30 px-3.5 py-2.5 text-meta text-ink-med animate-fade-in">
            Inspecting <span className="font-medium text-ink-hi">{graphCapability.name}</span> — the proof graph above now shows only the evidence feeding this capability.{" "}
            <button type="button" onClick={() => setGraphCapability(null)} className="rounded font-medium text-intel hover:text-intel-firm focus-visible:outline-none">
              Clear filter
            </button>
          </p>
        )}
      </TabPanel>

      <TabPanel value="evidence" defaultValue="capabilities">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {evidence.map((ev) => (
            <EvidenceCard key={ev.id} evidence={ev} onInspect={setInspectEvidence} />
          ))}
        </div>
        {!evidence.length && (
          <Card><Card.Content><p className="text-body-sm text-ink-muted">No evidence captured yet.</p></Card.Content></Card>
        )}
      </TabPanel>

      <TabPanel value="contributions" defaultValue="capabilities">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_24rem]">
          <ContributionHeatmap heat={candidate?.contributionHeat} />
          <ProjectExplorer evidence={evidence.filter((e) => e.type === "repository")} onInspect={setInspectEvidence} />
        </div>
      </TabPanel>

      {recruiterView && match && (
        <TabPanel value="match" defaultValue="capabilities">
          <MatchContext match={match} job={job} evidence={evidence} onInspect={setInspectEvidence} />
        </TabPanel>
      )}

      <EvidenceDrawer
        evidence={inspectEvidence}
        onClose={() => setInspectEvidence(null)}
        capabilities={candidate?.capabilities}
      />
    </div>
  );
}

function MatchContext({ match, job, evidence, onInspect }) {
  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[20rem_1fr]">
      <Card className="h-fit">
        <Card.Header><Card.Title>Match vs requirement</Card.Title></Card.Header>
        <Card.Content className="flex flex-col gap-4">
          <ScoreRing value={match.score} size={84} tone={match.score >= 80 ? "verified" : "intel"} label="match" />
          <ul role="list" className="flex flex-col divide-y divide-line-subtle/60 text-body-sm">
            {job.requirementProfile.map((req) => (
              <li key={req.skill} className="flex items-center justify-between gap-2 py-2">
                <span className="truncate text-ink-hi">{req.skill}</span>
                {match.matchedSkills.includes(req.skill) ? (
                  <Badge tone="success" size="sm" dot>evidenced</Badge>
                ) : (
                  <Badge tone="caution" size="sm">gap</Badge>
                )}
              </li>
            ))}
          </ul>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header><Card.Title>Why this match exists</Card.Title></Card.Header>
        <Card.Content>
          <MatchBreakdown match={match} evidence={evidence} onInspectEvidence={onInspect} />
        </Card.Content>
      </Card>
    </div>
  );
}
