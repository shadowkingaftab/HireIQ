import { BarChart3, Users, Briefcase, ShieldCheck } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import MetricTile from "../components/intel/MetricTile";
import { TrendAreaChart, DistributionBarChart } from "../components/charts/Charts";
import Timeline from "../components/intel/Timeline";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { adminApi } from "../services/api";
import { DEMO_ADMIN_STATS } from "../demo/demoData";

/**
 * Admin command center — platform-level health and adoption.
 * Answers "is the system healthy and are we growing?"
 */
export default function AdminDashboard() {
  const q = useDomainData(["admin", "stats"], () => adminApi.stats(), DEMO_ADMIN_STATS);
  const stats = q.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Platform administration"
        title="Admin overview"
        description="System health, adoption trends and platform stability."
        actions={<DataSourceBadge source={q.source} />}
      />

      {q.isDemo && <DemoDataBanner />}

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          question="How many total users has the platform registered?"
          value={stats?.totals?.users?.toLocaleString() || "—"}
          context={`${stats?.totals?.candidates || 0} candidates · ${stats?.totals?.recruiters || 0} recruiters · ${stats?.totals?.organizations || 0} orgs`}
          icon={Users}
          tone="intel"
        />
        <MetricTile
          question="How are signups trending?"
          value={`${stats?.weeklySignups?.[stats.weeklySignups.length - 1] || 0}/week`}
          context={`up from ${stats?.weeklySignups?.[0] || 0} in week 1 — steady growth`}
          tone="verified"
        />
        <MetricTile
          question="What's the current system health status?"
          value={stats?.systemHealth?.api === "operational" ? "Healthy" : "Degraded"}
          context="API + ingestion are up; matching engine has queue backlog"
          tone={stats?.systemHealth?.api === "operational" ? "verified" : "caution"}
        />
        <MetricTile
          question="How many candidates are in active pipelines?"
          value={stats?.totals?.candidates?.toLocaleString() || "—"}
          context="candidates connected with at least one piece of evidence"
          icon={ShieldCheck}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <Card.Header><Card.Title>Weekly signups</Card.Title></Card.Header>
          <Card.Content>
            {stats?.weeklySignups && (
              <TrendAreaChart
                data={stats.weeklySignups.map((v, i) => ({ week: `W${i + 1}`, signups: v }))}
                series={[{ key: "signups", label: "Signups", tone: "intel" }]}
                question="Is platform adoption growing?"
              />
            )}
          </Card.Content>
        </Card>

        <Card>
          <Card.Header><Card.Title>System services</Card.Title></Card.Header>
          <Card.Content className="space-y-2.5">
            {stats?.systemHealth &&
              Object.entries(stats.systemHealth).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between gap-3 rounded-lg border border-line-subtle bg-surface-1/60 px-3.5 py-3">
                  <span className="capitalize text-body-sm text-ink-hi">{service.replace(/([A-Z])/g, " $1").trim()}</span>
                  <Badge tone={status === "operational" ? "success" : "warning"} size="sm" dot>{status}</Badge>
                </div>
              ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
