import PageHeader from "../components/ui/PageHeader";
import DataSourceBadge from "../components/intel/DataSourceBadge";
import { IntegrationsSection } from "./Settings";
import { integrationApi } from "../services/integrationApi";
import { useDomainData } from "../hooks/useDomainData";

/** Evidence-source connections. */
export default function Integrations() {
  const q = useDomainData(["integrations", "list"], () => integrationApi.list(), null);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Evidence sources"
        title="Integrations"
        description="Connect providers whose artifacts become verifiable evidence in your graph."
        actions={<DataSourceBadge source={q.source === "demo" ? "live" : q.source} />}
      />
      <IntegrationsSection embedded />
    </div>
  );
}
