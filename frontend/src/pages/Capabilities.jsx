import { useState } from "react";
import { GitBranch } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import CapabilityMeterList from "../components/intel/CapabilityMeterList";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import ProofGraph from "../components/graph/ProofGraph";
import EvidenceDrawer from "../components/evidence/EvidenceDrawer";
import { useDomainData } from "../hooks/useDomainData";
import { candidateApi } from "../services/candidateApi";
import { evidenceApi } from "../services/evidenceApi";
import { DEMO_CANDIDATES, DEMO_EVIDENCE, DEMO_CURRENT_CANDIDATE_ID } from "../demo/demoData";

const pipeline = [
  { stage: "Claim", note: "You say you can do it" },
  { stage: "Evidence", note: "Artifacts get attached" },
  { stage: "Signal", note: "Verification scores quality" },
  { stage: "Capability", note: "Signals compound into strength" },
];

/** How a raw claim compounds into a scored capability. */
export default function Capabilities() {
  const [inspectEvidence, setInspectEvidence] = useState(null);
  const [focused, setFocused] = useState(null);

  const meQ = useDomainData(
    ["candidate", "capabilities"],
    () => candidateApi.list({ id: DEMO_CURRENT_CANDIDATE_ID }),
    DEMO_CANDIDATES.find((c) => c.id === DEMO_CURRENT_CANDIDATE_ID)
  );
  const candidate = meQ.data;

  const evidenceQ = useDomainData(
    ["evidence", "capabilities"],
    () => evidenceApi.listForCandidate(DEMO_CURRENT_CANDIDATE_ID),
    DEMO_EVIDENCE.filter((ev) => ev.candidateId === DEMO_CURRENT_CANDIDATE_ID)
  );

  const focusedCap = candidate?.capabilities?.find((c) => c.name === focused);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Capability intelligence"
        title="Capabilities"
        description="A capability is not a keyword — it's a score built from verified signals, each carrying its own uncertainty."
        actions={<DataSourceBadge source={meQ.source} />}
      />

      {meQ.isDemo && <DemoDataBanner />}

      {/* The compounding pipeline */}
      <section aria-label="How capabilities are built" className="panel p-5">
        <h2 className="text-micro font-medium uppercase tracking-caps text-intel">From claim to capability</h2>
        <ol role="list" className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          {pipeline.map(({ stage, note }, i) => (
            <li key={stage} className="relative rounded-lg border border-line-subtle bg-surface-1/60 px-4 py-3">
              <span aria-hidden="true" className="numeric font-mono text-micro text-intel">0{i + 1}</span>
              <p className="mt-1 text-body-sm font-medium text-ink-hi">{stage}</p>
              <p className="mt-0.5 text-meta leading-snug text-ink-faint">{note}</p>
              {i < pipeline.length - 1 && (
                <span aria-hidden="true" className="absolute -right-[9px] top-1/2 hidden h-px w-4 bg-line-strong sm:block" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {focusedCap ? (
        <Card>
          <Card.Header className="flex-row items-center justify-between">
            <Card.Title>{focusedCap.name} — evidence feeding this capability</Card.Title>
            <button
              type="button"
              onClick={() => setFocused(null)}
              className="rounded text-meta font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none"
            >
              Show all
            </button>
          </Card.Header>
          <Card.Content>
            <ProofGraph
              evidence={(evidenceQ.data || []).filter((ev) =>
                ev.skills.some((s) => s.toLowerCase().includes(focusedCap.name.toLowerCase().split(" ")[0]))
              )}
              capabilities={[focusedCap]}
              className="animate-fade-in"
            />
          </Card.Content>
        </Card>
      ) : (
        <ProofGraph
          evidence={evidenceQ.data || []}
          capabilities={candidate?.capabilities || []}
          className="animate-fade-up"
        />
      )}

      <Card>
        <Card.Header>
          <Card.Title className="flex items-center gap-2">
            <GitBranch size={16} aria-hidden="true" className="text-intel" /> All capabilities
          </Card.Title>
        </Card.Header>
        <Card.Content className="p-2">
          <CapabilityMeterList
            capabilities={candidate?.capabilities || []}
            onInspect={(cap) => setFocused(focused === cap.name ? null : cap.name)}
          />
        </Card.Content>
      </Card>

      <EvidenceDrawer
        evidence={inspectEvidence}
        onClose={() => setInspectEvidence(null)}
        capabilities={candidate?.capabilities}
      />
    </div>
  );
}
