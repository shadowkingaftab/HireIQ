import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import MatchScore from "../components/matching/MatchScore";
import { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { DEMO_CANDIDATES, DEMO_JOBS, DEMO_MATCHES } from "../demo/demoData";

export default function RecruiterMatches() {
  const matches = [...DEMO_MATCHES].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Recruiting intelligence"
        title="Candidate matches"
        description="Candidates ranked against open roles, with the evidence behind each fit."
        actions={<Button to="/jobs" variant="secondary">View jobs</Button>}
      />
      <DemoDataBanner note="Showing sample candidate matches." />

      <ul role="list" className="flex flex-col gap-4">
        {matches.map((match) => {
          const candidate = DEMO_CANDIDATES.find((item) => item.id === match.candidateId);
          const job = DEMO_JOBS.find((item) => item.id === match.jobId);
          if (!candidate || !job) return null;

          return (
            <li key={`${match.candidateId}-${match.jobId}`}>
              <Link
                to={`/candidates/${match.candidateId}/match/${match.jobId}`}
                className="group flex flex-col gap-4 rounded-panel border border-line-subtle bg-surface-1/70 p-5 transition-colors hover:border-line-strong hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-intel sm:flex-row sm:items-center"
              >
                <MatchScore match={match} size={60} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-section-sm font-medium text-ink-hi group-hover:text-intel">
                      {candidate.name}
                    </h2>
                    <Badge tone={match.stage === "offer" ? "success" : "info"} size="sm" dot>
                      {match.stage}
                    </Badge>
                  </div>
                  <p className="mt-1 text-meta text-ink-muted">
                    {job.ref} · {job.title}
                  </p>
                  <p className="mt-2 line-clamp-2 text-meta leading-relaxed text-ink-muted">
                    {match.explanation}
                  </p>
                </div>
                <span className="shrink-0 text-meta font-medium text-intel">Review candidate →</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
