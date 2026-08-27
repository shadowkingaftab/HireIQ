import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Timeline from "../components/intel/Timeline";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { DEMO_ACTIVITY } from "../demo/demoData";

/** Full account activity — every event that touched your proof graph. */
export default function Activity() {
  const q = useDomainData(["activity", "all"], async () => [], DEMO_ACTIVITY);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Transparency"
        title="Activity"
        description="A complete record of what happened around your profile — verifications, views, matches and assessment events."
        actions={<DataSourceBadge source={q.source} />}
      />
      {q.isDemo && <DemoDataBanner />}
      <Card>
        <Card.Content className="p-6">
          <Timeline items={q.data || []} />
        </Card.Content>
      </Card>
    </div>
  );
}
