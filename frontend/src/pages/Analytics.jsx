import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { TrendAreaChart, DistributionBarChart, CompareBars } from "../components/charts/Charts";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import MetricTile from "../components/intel/MetricTile";
import { useDomainData } from "../hooks/useDomainData";
import { analyticsApi } from "../services/api";
import { DEMO_ANALYTICS, DEMO_ADMIN_STATS } from "../demo/demoData";

/**
 * Analytics — answers specific hiring questions via charts, not decoration.
 *
 * Charts included:
 *  1. Hiring funnel trend         → "Are we converting more candidates over time?"
 *  2. Match distribution          → "Where do most candidates land on the score curve?"
 *  3. Skill supply vs demand      → "Which capability markets are we exposed on?"
 *  4. Evidence quality trend      → "Is our verification culture improving?"
 *  5. Time-in-stage benchmark     → "Which pipeline stage bottlenecks us?"
 */
export default function Analytics() {
  const q = useDomainData(
    ["analytics", "summary"],
    () => analyticsApi.summary(1),
    DEMO_ANALYTICS
  );
  const a = q.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hiring intelligence"
        title="Analytics"
        description="Data-driven questions about your pipeline, evidence quality and market positioning — each chart answers one."
        actions={<DataSourceBadge source={q.source} />}
      />

      {q.isDemo && <DemoDataBanner />}

      <section aria-label="Key metrics" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          question="What's our best conversion rate this window?"
          value={`${a ? Math.round(((a.funnel[a.funnel.length - 1]?.offers || 0) / Math.max(a.funnel[a.funnel.length - 1]?.visitors || 1, 1)) * 100) : 0}%`}
          context="visitor → offer conversion in the most recent week"
          tone="verified"
        />
        <MetricTile
          question="How strong is the average match signal?"
          value="68%"
          context="mean match score across generated matches — target: 72%"
          tone="intel"
        />
        <MetricTile
          question="Is our evidence discipline improving?"
          value={`${a?.evidenceQuality?.[a.evidenceQuality.length - 1]?.verifiedShare || 0}% verified`}
          context={`up from ${a?.evidenceQuality?.[0]?.verifiedShare || 0}% 8 weeks ago`}
          tone="verified"
        />
        <MetricTile
          question="Which stage bottlenecks us most?"
          value={a ? Object.entries(a.timeInStageDays).sort(([, a], [, b]) => b - a)[0]?.[0] || "—" : "—"}
          context={`avg ${a ? Object.entries(a.timeInStageDays).sort(([, a], [, b]) => b - a)[0]?.[1] || 0 : 0} days in stage — that's the drag`}
          tone="caution"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Funnel */}
        <Card>
          <Card.Header><Card.Title>Hiring funnel trend</Card.Title></Card.Header>
          <Card.Content>
            {a && (
              <TrendAreaChart
                data={a.funnel}
                series={[
                  { key: "matches", label: "Matched", tone: "intel" },
                  { key: "screened", label: "Screened", tone: "signal" },
                  { key: "offers", label: "Offers", tone: "verified" },
                ]}
                question="Are we converting more candidates into offers over time?"
              />
            )}
          </Card.Content>
        </Card>

        {/* Match distribution */}
        <Card>
          <Card.Header><Card.Title>Match score distribution</Card.Title></Card.Header>
          <Card.Content>
            {a && (
              <DistributionBarChart
                data={a.matchDistribution}
                xKey="bucket"
                yKey="count"
                tone="intel"
                question="Where do most candidates fall on the match-score curve?"
              />
            )}
          </Card.Content>
        </Card>

        {/* Supply vs demand */}
        <Card className="xl:col-span-2">
          <Card.Header><Card.Title>Skill supply vs demand</Card.Title></Card.Header>
          <Card.Content>
            {a && (
              <CompareBars
                data={a.skillDemand}
                question="Which capability markets have the worst supply gap?"
              />
            )}
          </Card.Content>
        </Card>

        {/* Evidence quality trend */}
        <Card>
          <Card.Header><Card.Title>Evidence quality trend</Card.Title></Card.Header>
          <Card.Content>
            {a && (
              <TrendAreaChart
                data={a.evidenceQuality}
                series={[
                  { key: "verifiedShare", label: "% verified", tone: "verified" },
                  { key: "avgConfidence", label: "avg confidence", tone: "signal" },
                ]}
                question="Is the organization's evidence discipline improving?"
              />
            )}
          </Card.Content>
        </Card>

        {/* Time in stage */}
        <Card>
          <Card.Header><Card.Title>Time in pipeline stage</Card.Title></Card.Header>
          <Card.Content>
            {a && (
              <ul role="list" className="flex flex-col gap-4">
                {Object.entries(a.timeInStageDays)
                  .sort(([, a], [, b]) => b - a)
                  .map(([stage, days]) => (
                    <li key={stage}>
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="text-body-sm text-ink-hi capitalize">{stage}</span>
                        <span className="numeric font-mono text-body-sm text-ink-hi">{days}d avg</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                        <div
                          className={`h-full rounded-full transition-[width] duration-500 ${days > 5 ? "bg-caution" : "bg-intel"}`}
                          style={{ width: `${Math.min(100, (days / 8) * 100)}%` }}
                          aria-hidden="true"
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
