import { Target } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import MatchScore from "../components/matching/MatchScore";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { EmptyState } from "../components/ui";
import { useDomainData } from "../hooks/useDomainData";
import { matchingApi } from "../services/matchingApi";
import { DEMO_MATCHES, DEMO_JOBS, DEMO_CURRENT_CANDIDATE_ID } from "../demo/demoData";

/** Opportunities ranked by fit — each with the why attached. */
export default function Matches() {
  const q = useDomainData(
    ["matches", "opportunities"],
    () => matchingApi.forJob(DEMO_JOBS[0].id, {}),
    DEMO_MATCHES.filter((m) => m.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );
  const matches = [...(q.data || [])].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Opportunity intelligence"
        title="Matches"
        description="Roles where your evidence graph aligns with what teams need. Every score carries its reasoning — open one to see exactly why."
        actions={<DataSourceBadge source={q.source} />}
      />

      {q.isDemo && <DemoDataBanner />}

      {!matches.length && !q.isLoading ? (
        <EmptyState
          icon={Target}
          title="No active matches yet"
          description="As your evidence base grows and roles are published against it, ranked matches will appear here with full explanations."
        />
      ) : (
        <ul role="list" className="flex flex-col gap-4">
          {matches.map((m, i) => {
            const job = DEMO_JOBS.find((j) => j.id === m.jobId);
            if (!job) return null;
            return (
              <li key={`${m.jobId}-${m.candidateId}`} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
                <Link
                  to={`/matches/${m.jobId}`}
                  className="group block rounded-panel border border-line-subtle bg-surface-1/70 p-5 transition-all duration-150 hover:border-line-strong hover:bg-surface-1 hover:shadow-card focus-visible:border-intel focus-visible:outline-none"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <MatchScore match={m} size={72} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-section-sm text-ink-hi group-hover:text-intel">{job.title}</h3>
                        <Badge tone={job.status === "open" ? "success" : "neutral"} size="sm" dot>{job.status}</Badge>
                      </div>
                      <p className="numeric mt-1 font-mono text-micro text-ink-faint">
                        {job.ref} · {job.location} · {job.employment}
                      </p>
                      <p className="mt-2 line-clamp-2 text-meta leading-relaxed text-ink-muted">{m.explanation}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {m.matchedSkills.slice(0, 4).map((s) => (
                          <Badge key={s} tone="success" size="sm" dot>{s}</Badge>
                        ))}
                        {m.missingSkills.slice(0, 2).map((s) => (
                          <Badge key={s} tone="neutral" size="sm">{s} gap</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
