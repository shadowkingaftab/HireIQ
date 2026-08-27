import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import CapabilityMeterList from "../components/intel/CapabilityMeterList";
import MatchBreakdown from "../components/matching/MatchBreakdown";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { DEMO_CANDIDATES, DEMO_JOBS, DEMO_MATCHES, DEMO_EVIDENCE } from "../demo/demoData";

/**
 * Side-by-side comparison of candidates against the same job. Answers
 * "which of these two would I bet on, and why?"
 */
export default function CandidateComparison() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobId, setJobId] = useState(() => Number(searchParams.get("jobId")) || DEMO_JOBS[0]?.id);
  const [ids, setIds] = useState(() => {
    const initial = searchParams.get("ids");
    if (initial) return initial.split(",").map(Number).filter(Boolean);
    return DEMO_CANDIDATES.slice(0, 2).map((c) => c.id);
  });

  const q = useDomainData(["candidates", "compare"], async () => [], null);
  const job = DEMO_JOBS.find((j) => j.id === jobId);

  const pairs = useMemo(() => {
    return ids.map((id) => {
      const candidate = DEMO_CANDIDATES.find((c) => c.id === id);
      const match = DEMO_MATCHES.find((m) => m.candidateId === id && m.jobId === jobId);
      const evidence = DEMO_EVIDENCE.filter((e) => e.candidateId === id);
      return { candidate, match, evidence };
    });
  }, [ids, jobId]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Direct comparison"
        title="Candidate comparison"
        description="Same role, side by side — capability alignment, evidence depth and match reasoning exposed simultaneously."
        actions={<DataSourceBadge source={q.source} />}
      />

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-micro text-ink-faint">Role</span>
          <select
            value={jobId}
            onChange={(e) => setJobId(Number(e.target.value))}
            className="h-10 rounded-lg border border-line-subtle bg-surface-1 px-3 text-body-sm text-ink-hi focus:border-intel focus:outline-none"
            aria-label="Compare against role"
          >
            {DEMO_JOBS.map((j) => (
              <option key={j.id} value={j.id}>{j.ref} · {j.title}</option>
            ))}
          </select>
        </label>
        <p className="text-meta text-ink-muted">
          {pairs.length} candidate{pairs.length === 1 ? "" : "s"} · {job?.requirementProfile?.length ?? 0} requirement{job?.requirementProfile?.length === 1 ? "" : "s"}
        </p>
      </div>

      {q.isDemo && <DemoDataBanner />}

      {!pairs.length ? (
        <p className="text-body-sm text-ink-muted">No candidates selected. Add candidates via search or the compare action.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {pairs.map(({ candidate, match, evidence }) => {
            if (!candidate) return <div key="empty"><p className="text-body-sm text-ink-muted">Candidate not found.</p></div>;
            const topCaps = [...candidate.capabilities].sort((a, b) => b.score - a.score).slice(0, 4);
            return (
              <div key={candidate.id} className="flex flex-col gap-5">
                <Card>
                  <Card.Header className="flex-row items-center justify-between">
                    <Card.Title>{candidate.name}</Card.Title>
                    <button type="button" onClick={() => setIds((prev) => prev.filter((i) => i !== candidate.id))} className="rounded p-1 text-ink-faint hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none" aria-label={`Remove ${candidate.name}`}>
                      <X size={14} />
                    </button>
                  </Card.Header>
                  <Card.Content>
                    <div className="flex items-center gap-6">
                      {match && <ScoreRing value={match.score} size={72} tone={match.score >= 80 ? "verified" : "intel"} label="match" />}
                      <div>
                        <p className="text-body-sm text-ink-muted">{candidate.headline}</p>
                        {match && <ConfidenceBar value={100 - match.uncertainty} uncertainty={match.uncertainty} className="mt-2 max-w-xs" />}
                      </div>
                    </div>
                    <ul role="list" className="mt-4 flex flex-wrap gap-1.5">
                      {candidate.skills.slice(0, 6).map((s) => (
                        <li key={s} className="rounded border border-line-subtle bg-surface-2/60 px-1.5 py-0.5 text-micro text-ink-muted">{s}</li>
                      ))}
                    </ul>
                  </Card.Content>
                </Card>

                {/* Capabilities */}
                <Card>
                  <Card.Header><Card.Title>Top capabilities</Card.Title></Card.Header>
                  <Card.Content className="p-2">
                    <CapabilityMeterList capabilities={topCaps} />
                  </Card.Content>
                </Card>

                {/* Match explanation */}
                {match && (
                  <Card>
                    <Card.Header><Card.Title>Match reasoning</Card.Title></Card.Header>
                    <Card.Content>
                      <MatchBreakdown match={match} evidence={evidence} />
                    </Card.Content>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
