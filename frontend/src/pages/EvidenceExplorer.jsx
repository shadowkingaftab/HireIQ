import { useMemo, useState } from "react";
import { ShieldCheck, Upload } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import EvidenceCard from "../components/evidence/EvidenceCard";
import EvidenceDrawer from "../components/evidence/EvidenceDrawer";
import { useDomainData } from "../hooks/useDomainData";
import { evidenceApi } from "../services/evidenceApi";
import { DEMO_CANDIDATES, DEMO_EVIDENCE, DEMO_CURRENT_CANDIDATE_ID } from "../demo/demoData";
import { EmptyState } from "../components/ui";

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "repository", label: "Repositories" },
  { value: "assessment", label: "Assessments" },
  { value: "contribution", label: "Contributions" },
  { value: "work_history", label: "Work history" },
];

/** Evidence portfolio — the candidate's proof inventory. */
export default function EvidenceExplorer() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [inspectEvidence, setInspectEvidence] = useState(null);

  const meQ = useDomainData(
    ["candidate", "evidence-page"],
    () => candidateApi.list({ id: DEMO_CURRENT_CANDIDATE_ID }),
    DEMO_CANDIDATES.find((c) => c.id === DEMO_CURRENT_CANDIDATE_ID)
  );
  const evidenceQ = useDomainData(
    ["evidence", "portfolio"],
    () => evidenceApi.listForCandidate(DEMO_CURRENT_CANDIDATE_ID),
    DEMO_EVIDENCE.filter((ev) => ev.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );
  const evidence = evidenceQ.data || [];

  const filtered = useMemo(() => {
    return evidence.filter((ev) => {
      if (typeFilter !== "all" && ev.type !== typeFilter) return false;
      if (query && !`${ev.title} ${ev.skills.join(" ")} ${ev.source}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [evidence, typeFilter, query]);

  const verified = evidence.filter((e) => e.verified).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Proof portfolio"
        title="Evidence"
        description="Everything that backs your profile — with provenance you can inspect and verification you can trust."
        actions={
          <>
            <DataSourceBadge source={meQ.source} />
            <Button leadingIcon={<Upload size={15} />}>Connect new evidence</Button>
          </>
        }
      />

      {meQ.isDemo && <DemoDataBanner />}

      {/* Coverage summary — answers "how backed am I?" */}
      <section aria-label="Coverage" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCoverage question="How much of your profile is verified?" value={`${Math.round((verified / Math.max(evidence.length, 1)) * 100)}%`} context={`${verified} of ${evidence.length} items independently verified`} tone="verified" />
        <MetricCoverage question="Which sources carry your strongest signals?" value="GitHub · Assessments" context="third-party attested artifacts outperform self-reported claims" />
        <MetricCoverage question="Where are you exposed?" value="1 weak item" context="EV-2044 work history is unverified — add an endorsement or document" tone="caution" />
      </section>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Filter by title, skill or source…"
          aria-label="Search evidence"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-sm"
          disabled={evidenceQ.isLoading}
        />
        <Tabs
          value={typeFilter}
          onChange={setTypeFilter}
          items={TYPE_FILTERS.map(({ value, label }) => ({ value, label }))}
          className="overflow-x-auto"
        />
      </div>

      <TabPanel value="list" defaultValue="list">
        {filtered.length ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {filtered.map((ev, i) => (
              <EvidenceCard
                key={ev.id}
                evidence={ev}
                onInspect={setInspectEvidence}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShieldCheck}
            title="No matching evidence"
            description="Nothing in your portfolio matches this filter yet."
            action={
              <Button variant="secondary" onClick={() => { setQuery(""); setTypeFilter("all"); }}>
                Clear filters
              </Button>
            }
          />
        )}
      </TabPanel>

      <EvidenceDrawer
        evidence={inspectEvidence}
        onClose={() => setInspectEvidence(null)}
        capabilities={meQ.data?.capabilities}
      />
    </div>
  );
}

function MetricCoverage({ question, value, context, tone = "default" }) {
  const toneCls =
    tone === "verified" ? "text-verified" : tone === "caution" ? "text-caution" : "text-ink-hi";
  return (
    <div className="panel p-5">
      <p className="text-meta text-ink-muted">{question}</p>
      <p className={`numeric mt-2 font-mono text-section font-semibold ${toneCls}`}>{value}</p>
      <p className="mt-1 text-meta leading-snug text-ink-faint">{context}</p>
    </div>
  );
}
