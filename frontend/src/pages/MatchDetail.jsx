import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import MatchBreakdown from "../components/matching/MatchBreakdown";
import ProofGraph from "../components/graph/ProofGraph";
import EvidenceDrawer from "../components/evidence/EvidenceDrawer";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { matchingApi } from "../services/matchingApi";
import {
  DEMO_MATCHES,
  DEMO_JOBS,
  DEMO_CANDIDATES,
  DEMO_EVIDENCE,
  DEMO_CURRENT_CANDIDATE_ID,
} from "../demo/demoData";

/**
 * Full match explanation for one job: weighted contributions, gaps,
 * uncertainty, supporting evidence and the proof graph behind it.
 */
export default function MatchDetail() {
  const { jobId } = useParams();
  const [inspectEvidence, setInspectEvidence] = useState(null);
  const jobIdNum = Number(jobId);

  const jobQ = useDomainData(
    ["job", jobId],
    () => import("../services/api").then(({ jobApi }) => jobApi.get(jobIdNum)),
    DEMO_JOBS.find((j) => j.id === jobIdNum)
  );
  const job = jobQ.data;

  const matchQ = useDomainData(
    ["match", "detail", jobId],
    () => matchingApi.forJob(jobIdNum, {}),
    DEMO_MATCHES.find((m) => m.jobId === jobIdNum && m.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );
  const match = matchQ.data;

  const evidenceQ = useDomainData(
    ["evidence", "match-detail"],
    async () => [],
    DEMO_EVIDENCE.filter((ev) => ev.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );
  const evidence = evidenceQ.data || [];

  if (!job || !match) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Match not found" />
        <Card><Card.Content><p className="text-body-sm text-ink-muted">This match no longer exists or was never generated.</p></Card.Content></Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          to="/matches"
          className="mb-4 inline-flex items-center gap-1.5 rounded text-meta font-medium text-ink-muted transition-colors hover:text-intel focus-visible:outline-none"
        >
          <ArrowLeft size={14} aria-hidden="true" /> All matches
        </Link>
        <PageHeader
          eyebrow={`Match intelligence · ${job.ref}`}
          title={job.title}
          description={`${job.location} · ${job.employment} · salary ${job.currency} ${job.salary_min?.toLocaleString()}–${job.salary_max?.toLocaleString()}`}
          actions={
            <>
              <DataSourceBadge source={matchQ.source} />
              {match.stage && <Badge tone={match.score >= 80 ? "success" : "info"} size="md" dot>stage: {match.stage}</Badge>}
            </>
          }
        />
      </div>

      {(jobQ.isDemo || matchQ.isDemo) && <DemoDataBanner />}

      {/* The why */}
      <Card>
        <Card.Header><Card.Title>Why this match exists</Card.Title></Card.Header>
        <Card.Content>
          <p className="mb-5 rounded-lg border border-intel/20 bg-intel-soft/25 px-3.5 py-3 text-body-sm leading-relaxed text-ink-med">
            {match.explanation}
          </p>
          <MatchBreakdown
            match={match}
            evidence={evidence}
            onInspectEvidence={setInspectEvidence}
          />
        </Card.Content>
      </Card>

      {/* The graph behind it */}
      <ProofGraph
        evidence={evidence}
        capabilities={DEMO_CANDIDATES.find((c) => c.id === DEMO_CURRENT_CANDIDATE_ID)?.capabilities}
        job={job}
        match={match}
        className="animate-fade-up"
      />

      {/* Requirements table */}
      <Card>
        <Card.Header><Card.Title>Requirement-by-requirement</Card.Title></Card.Header>
        <Card.Content className="p-0">
          <ul role="list" className="divide-y divide-line-subtle/60">
            {job.requirementProfile.map((req) => {
              const has = match.matchedSkills.includes(req.skill);
              return (
                <li key={req.skill} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3.5">
                  <div>
                    <p className="text-body-sm font-medium text-ink-hi">{req.skill}</p>
                    <p className="numeric text-micro text-ink-faint">
                      weight ×{req.weight.toFixed(2)} · min confidence {req.minConfidence}
                    </p>
                  </div>
                  <Badge tone={has ? "success" : "danger"} size="sm" dot={has}>
                    {has ? "evidenced" : "gap — see breakdown"}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Card.Content>
      </Card>

      <EvidenceDrawer evidence={inspectEvidence} onClose={() => setInspectEvidence(null)} />
    </div>
  );
}
