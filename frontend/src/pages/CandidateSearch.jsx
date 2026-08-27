import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Tabs, { TabPanel } from "../components/ui/Tabs";
import { ScoreRing, ConfidenceBar } from "../components/ui/Progress";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import MatchBreakdown from "../components/matching/MatchBreakdown";
import ProofGraph from "../components/graph/ProofGraph";
import EvidenceCard from "../components/evidence/EvidenceCard";
import EvidenceDrawer from "../components/evidence/EvidenceDrawer";
import { useDomainData } from "../hooks/useDomainData";
import { DEMO_CANDIDATES, DEMO_JOBS, DEMO_MATCHES, DEMO_EVIDENCE } from "../demo/demoData";

const EVIDENCE_FILTERS = ["all", "strong", "moderate", "weak"];
const OPENNESS = ["all", "actively looking", "open to offers", "not looking", "casually browsing"];

/**
 * FLAGSHIP recruiter screen — intelligence search.
 *
 * Answers "who should I be talking to, and why?" by ranking candidates
 * against a selected job's requirement profile, then showing the reasoning
 * immediately in the result row.
 */
export default function CandidateSearch() {
  const [query, setQuery] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState("all");
  const [openness, setOpenness] = useState("all");
  const [selectedJobId, setSelectedJobId] = useState(DEMO_JOBS[0]?.id);
  const [sortKey, setSortKey] = useState("match"); // "match" | "evidence" | "lastActive"
  const [expandedId, setExpandedId] = useState(null);
  const [inspectEvidence, setInspectEvidence] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const q = useDomainData(["recruiter", "search"], async () => [], null);

  const selectedJob = DEMO_JOBS.find((j) => j.id === selectedJobId);

  // Attempt live search then merge; fallback to demo filter
  const candidates = useMemo(() => {
    let list = [...DEMO_CANDIDATES];
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) =>
        `${c.name} ${c.headline} ${c.skills.join(" ")} ${c.summary}`.toLowerCase().includes(q)
      );
    }
    if (evidenceFilter !== "all") list = list.filter((c) => c.evidenceStrength === evidenceFilter);
    if (openness !== "all") list = list.filter((c) => c.openness === openness);

    // Rank against selected job
    const matchMap = new Map(DEMO_MATCHES.filter((m) => m.jobId === selectedJobId).map((m) => [m.candidateId, m]));
    const ranked = list.map((c) => ({
      ...c,
      match: matchMap.get(c.id),
      avgCapability: Math.round(c.capabilities.reduce((acc, cap) => acc + cap.score, 0) / c.capabilities.length),
    }));

    if (sortKey === "match") ranked.sort((a, b) => (b.match?.score || 0) - (a.match?.score || 0));
    else if (sortKey === "evidence") ranked.sort((a, b) => (b.evidenceCount) - (a.evidenceCount));
    else ranked.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));

    return ranked;
  }, [query, evidenceFilter, openness, selectedJobId, sortKey]);

  const [evidenceCache, setEvidenceCache] = useState({});

  const loadEvidence = (candidateId) => {
    if (evidenceCache[candidateId]) return evidenceCache[candidateId];
    const ev = DEMO_EVIDENCE.filter((e) => e.candidateId === candidateId);
    setEvidenceCache((prev) => ({ ...prev, [candidateId]: ev }));
    return ev;
  };

  const toggleSort = () => setSortKey((k) => (k === "match" ? "evidence" : k === "evidence" ? "lastActive" : "match"));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Intelligence search"
        title="Candidate Search"
        description="Ranked by fit to the selected role — every result immediately shows why it's here, not just that it matches."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button variant="secondary" leadingIcon={<SlidersHorizontal size={15} />}>
              Export results
            </Button>
          </>
        }
      />

      {q.isDemo && <DemoDataBanner />}

      {/* Search + role selector + sort */}
      <section aria-label="Search controls" className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search by name, headline, skill or description…"
            aria-label="Search candidates"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leadingIcon={Search}
          />
        </div>
        <div className="flex items-center gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-micro text-ink-faint">Ranking against</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(Number(e.target.value))}
              className="h-10 rounded-lg border border-line-subtle bg-surface-1 px-3 text-body-sm text-ink-hi focus:border-intel focus:outline-none"
              aria-label="Rank candidates against role"
            >
              {DEMO_JOBS.map((j) => (
                <option key={j.id} value={j.id}>{j.ref} · {j.title}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={toggleSort}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-line-subtle bg-surface-1 px-3 text-body-sm text-ink-med transition-colors hover:border-line-strong focus-visible:outline-none"
            aria-label={`Sort by ${sortKey === "match" ? "evidence count" : sortKey === "evidence" ? "last active" : "match score"}`}
          >
            <ArrowUpDown size={14} aria-hidden="true" />
            {sortKey === "match" ? "Match" : sortKey === "evidence" ? "Evidence" : "Last active"}
          </button>
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex h-10 items-center gap-1.5 rounded-lg border border-line-subtle bg-surface-1 px-3 text-body-sm text-ink-med transition-colors hover:border-line-strong focus-visible:outline-none"
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal size={14} aria-hidden="true" />
            Filters
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </section>

      {/* Filters */}
      {filtersOpen && (
        <div className="animate-fade-up rounded-panel border border-line-subtle bg-surface-1/60 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="text-micro text-ink-faint">Evidence strength</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {EVIDENCE_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setEvidenceFilter(f)}
                    className={`rounded-lg px-2.5 py-1 text-meta transition-colors ${
                      evidenceFilter === f
                        ? "bg-intel text-white"
                        : "bg-surface-2 text-ink-med hover:bg-surface-3"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-micro text-ink-faint">Openness</label>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {OPENNESS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setOpenness(f)}
                    className={`rounded-lg px-2.5 py-1 text-meta transition-colors ${
                      openness === f
                        ? "bg-intel text-white"
                        : "bg-surface-2 text-ink-med hover:bg-surface-3"
                    }`}
                  >
                    {f === "all" ? "Any" : f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-micro text-ink-faint">Requirements for this search</p>
              <ul role="list" className="mt-1.5 flex flex-wrap gap-1.5">
                {selectedJob?.requirementProfile.map((r) => (
                  <li key={r.skill} className="rounded border border-line-subtle bg-surface-2/60 px-1.5 py-0.5 text-micro text-ink-muted">
                    {r.skill} ×{r.weight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Results list */}
      <section aria-label="Ranked results">
        {!candidates.length ? (
          <Card>
            <Card.Content className="py-14 text-center">
              <Search size={24} aria-hidden="true" className="mx-auto mb-3 text-ink-faint" />
              <p className="text-section-sm text-ink-hi">No candidates match these filters</p>
              <p className="mt-2 max-w-md mx-auto text-body-sm text-ink-muted">
                Broaden the evidence strength or openness filters, or try a different query.
              </p>
              <Button
                variant="secondary"
                className="mt-5"
                onClick={() => { setQuery(""); setEvidenceFilter("all"); setOpenness("all"); }}
              >
                Clear all filters
              </Button>
            </Card.Content>
          </Card>
        ) : (
          <ul role="list" className="flex flex-col gap-4">
            {candidates.map((c, i) => {
              const expanded = expandedId === c.id;
              const match = c.match;
              const cEvidence = DEMO_EVIDENCE.filter((e) => e.candidateId === c.id);
              const verifiedShare = cEvidence.length
                ? Math.round((cEvidence.filter((e) => e.verified).length / cEvidence.length) * 100)
                : 0;
              return (
                <li key={c.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 30, 180)}ms` }}>
                  <Card className="overflow-hidden">
                    <Card.Content className="p-0">
                      {/* Collapsed row */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(expanded ? null : c.id)}
                        className="flex w-full flex-col gap-5 p-5 text-left transition-colors hover:bg-surface-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-intel lg:flex-row lg:items-center"
                        aria-expanded={expanded}
                        aria-label={`Candidate ${c.name}: match ${match?.score ?? "—"}%, rank ${match?.rank ?? "—"}`}
                      >
                        {/* Rank */}
                        <span className="numeric flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line-subtle bg-surface-2 font-mono text-section font-bold text-ink-faint">
                          {match?.rank ?? "—"}
                        </span>

                        {/* Identity */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-section-sm text-ink-hi">{c.name}</h3>
                            <Badge tone={c.evidenceStrength} size="sm" dot>{c.evidenceStrength} evidence</Badge>
                            {c.openness === "actively looking" && <Badge tone="success" size="sm">open</Badge>}
                          </div>
                          <p className="mt-0.5 text-meta text-ink-muted">{c.headline}</p>
                          <p className="numeric mt-0.5 text-micro text-ink-faint">
                            {c.location} · {c.evidenceCount} evidence · {verifiedShare}% verified · {c.assessmentsCompleted} assessments
                          </p>
                        </div>

                        {/* Score + confidence */}
                        <div className="flex items-center gap-5 lg:w-72">
                          {match ? (
                            <ScoreRing
                              value={match.score}
                              size={56}
                              tone={match.score >= 80 ? "verified" : "intel"}
                            />
                          ) : (
                            <span className="text-body-sm text-ink-faint">No match score</span>
                          )}
                          {match && (
                            <div className="min-w-0 flex-1">
                              <ConfidenceBar
                                value={100 - Math.min(50, match.uncertainty)}
                                uncertainty={match.uncertainty}
                                aria-label="Match confidence"
                              />
                              <p className="mt-1 line-clamp-1 text-micro text-ink-faint">
                                ±{match.uncertainty}% · rank #{match.rank}
                              </p>
                            </div>
                          )}
                        </div>

                        <span aria-hidden="true" className="hidden shrink-0 text-ink-faint lg:block">
                          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </button>

                      {/* Expanded intelligence panel */}
                      {expanded && (
                        <div className="border-t border-line-subtle bg-surface-1/40 p-5 animate-fade-in">
                          <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_20rem]">
                            {/* Proof graph */}
                            <ProofGraph
                              evidence={cEvidence}
                              capabilities={c.capabilities}
                              job={selectedJob}
                              match={match}
                            />
                            {/* Capabilities sidebar */}
                            <Card className="h-fit">
                              <Card.Header><Card.Title>Capability breakdown</Card.Title></Card.Header>
                              <Card.Content className="space-y-3.5">
                                {c.capabilities.map((cap) => (
                                  <div key={cap.name}>
                                    <div className="mb-1 flex items-center justify-between gap-2">
                                      <span className="truncate text-body-sm text-ink-hi">{cap.name}</span>
                                      <span className="numeric font-mono text-micro text-ink-faint">{cap.score}%</span>
                                    </div>
                                    <ConfidenceBar value={cap.score} uncertainty={cap.uncertainty} aria-label={`${cap.name} confidence`} />
                                    <p className="mt-0.5 text-micro text-ink-faint">{cap.evidenceCount} evidence items</p>
                                  </div>
                                ))}
                              </Card.Content>
                            </Card>
                          </div>

                          {/* Match explanation (recruiter-facing) */}
                          {match && (
                            <div className="mb-5">
                              <h4 className="text-micro font-medium uppercase tracking-caps text-intel mb-3">Why this match exists</h4>
                              <MatchBreakdown
                                match={match}
                                evidence={cEvidence}
                                onInspectEvidence={setInspectEvidence}
                              />
                            </div>
                          )}

                          {/* Supporting evidence preview */}
                          <div>
                            <h4 className="text-micro font-medium uppercase tracking-caps text-intel mb-3">Supporting evidence</h4>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {cEvidence.slice(0, 4).map((ev) => (
                                <EvidenceCard
                                  key={ev.id}
                                  evidence={ev}
                                  compact
                                  onInspect={() => setInspectEvidence(ev)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button to={`/candidates/${c.id}`} variant="secondary">Open full profile</Button>
                          </div>
                        </div>
                      )}
                    </Card.Content>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <EvidenceDrawer evidence={inspectEvidence} onClose={() => setInspectEvidence(null)} />
    </div>
  );
}
