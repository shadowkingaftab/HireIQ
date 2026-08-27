import { Link } from "react-router-dom";
import { Briefcase, Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import { SkeletonTable } from "../components/ui";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { jobApi } from "../services/jobApi";
import { DEMO_JOBS } from "../demo/demoData";

const statusTone = { open: "success", draft: "neutral", paused: "warning", closed: "danger" };

/** Job directory — all roles, their pipeline status, and evidence expectations. */
export default function Jobs() {
  const q = useDomainData(["jobs", "list"], () => jobApi.list(), DEMO_JOBS);
  const jobs = q.data || [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Requisition registry"
        title="Jobs"
        description="Each role defines what evidence matters — requirements become proof-graph edges the moment a candidate applies."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button to="/jobs/new" leadingIcon={<Plus size={15} />}>New job</Button>
          </>
        }
      />

      {q.isDemo && <DemoDataBanner />}

      {q.isLoading ? (
        <SkeletonTable rows={4} cols={4} />
      ) : !jobs.length ? (
        <Card><Card.Content className="py-14 text-center"><p className="text-body-sm text-ink-muted">No jobs published yet.</p></Card.Content></Card>
      ) : (
        <ul role="list" className="flex flex-col gap-4">
          {jobs.map((job) => (
            <li key={job.id}>
              <Link to={`/jobs/${job.id}`} className="group block rounded-panel border border-line-subtle bg-surface-1/70 p-5 transition-all hover:border-line-strong hover:bg-surface-1 hover:shadow-card focus-visible:border-intel focus-visible:outline-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-section-sm text-ink-hi group-hover:text-intel">{job.title}</h3>
                      <Badge tone={statusTone[job.status] || "neutral"} size="sm" dot>{job.status}</Badge>
                    </div>
                    <p className="numeric mt-1 font-mono text-micro text-ink-faint">
                      {job.ref} · {job.location} · {job.employment} · {job.applicantsCount} applicants
                    </p>
                    <p className="mt-2 line-clamp-2 text-meta leading-relaxed text-ink-muted">{job.description}</p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {job.requirementProfile.slice(0, 3).map((r) => (
                      <span key={r.skill} className="rounded border border-line-subtle bg-surface-2/60 px-1.5 py-0.5 text-micro text-ink-muted">
                        {r.skill} ×{r.weight}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
