import { Send } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { EmptyState } from "../components/ui";
import Timeline from "../components/intel/Timeline";
import { useDomainData } from "../hooks/useDomainData";
import { applicationApi } from "../services/applicationApi";
import { DEMO_APPLICATIONS, DEMO_JOBS, DEMO_CURRENT_CANDIDATE_ID, DEMO_ACTIVITY } from "../demo/demoData";

const stageTone = {
  applied: "neutral",
  screening: "info",
  interview: "warning",
  offer: "success",
};

/** Applications pipeline — candidate side. */
export default function Applications() {
  const q = useDomainData(
    ["applications", "mine"],
    () => applicationApi.list({}),
    DEMO_APPLICATIONS.filter((a) => a.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );
  const apps = (q.data || []).map((app) => ({
    ...app,
    job: DEMO_JOBS.find((j) => j.id === app.jobId),
  })).filter((a) => a.job);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Applications"
        description="Where you stand in each process — stages update as recruiters move you forward."
        actions={<DataSourceBadge source={q.source} />}
      />

      {q.isDemo && <DemoDataBanner />}

      {!apps.length && !q.isLoading ? (
        <EmptyState
          icon={Send}
          title="No applications yet"
          description="Apply directly to matches, or let verified evidence attract inbound interest."
          action={<Button to="/matches">Browse matches</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_24rem]">
          <Card>
            <Card.Content className="p-2">
              <ul role="list" className="divide-y divide-line-subtle/60">
                {apps.map((app) => (
                  <li key={app.id} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4">
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-medium text-ink-hi">{app.job.title}</p>
                      <p className="numeric font-mono text-micro text-ink-faint">
                        {app.job.ref} · via {app.source} · updated {new Date(app.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={stageTone[app.stage] || "neutral"} size="sm" dot>{app.stage}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Content>
          </Card>

          <aside className="panel p-5">
            <h3 className="text-micro font-medium uppercase tracking-caps text-intel">Stage reference</h3>
            <ol role="list" className="mt-3 flex flex-col gap-2.5">
              {[["applied", "Received and logged"], ["screening", "Being evaluated against requirements"], ["interview", "In conversation with the team"], ["offer", "Offer extended"]].map(([stage, desc]) => (
                <li key={stage} className="flex items-start gap-2.5">
                  <Badge tone={stageTone[stage]} size="sm">{stage}</Badge>
                  <span className="text-meta leading-snug text-ink-muted">{desc}</span>
                </li>
              ))}
            </ol>
            <h3 className="mt-6 text-micro font-medium uppercase tracking-caps text-intel">Related activity</h3>
            <Timeline items={DEMO_ACTIVITY.filter((a) => a.kind.includes("match") || a.kind.includes("view")).slice(0, 3)} className="mt-3" />
          </aside>
        </div>
      )}
    </div>
  );
}
