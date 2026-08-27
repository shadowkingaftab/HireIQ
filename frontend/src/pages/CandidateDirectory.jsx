import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Search as SearchIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import { ScoreRing } from "../components/ui/Progress";
import { EmptyState, SkeletonTable } from "../components/ui";
import DataSourceBadge, { DemoDataBanner } from "../components/intel/DataSourceBadge";
import { useDomainData } from "../hooks/useDomainData";
import { candidateApi } from "../services/candidateApi";
import { DEMO_CANDIDATES } from "../demo/demoData";

/** Candidate directory — searchable list of all connected candidates. */
export default function CandidateDirectory() {
  const [query, setQuery] = useState("");
  const q = useDomainData(["candidates", "list"], () => candidateApi.list(), DEMO_CANDIDATES);
  const list = useMemo(() => {
    if (!q.data) return [];
    if (!query) return q.data;
    const lq = query.toLowerCase();
    return q.data.filter((c) => `${c.name} ${c.headline} ${c.skills.join(" ")}`.toLowerCase().includes(lq));
  }, [q.data, query]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Talent universe"
        title="Candidates"
        description="All connected candidates with evidence strength and match score at a glance."
        actions={
          <>
            <DataSourceBadge source={q.source} />
            <Button to="/compare" variant="secondary">Compare</Button>
          </>
        }
      />
      {q.isDemo && <DemoDataBanner />}
      <Input
        type="search"
        placeholder="Filter by name, headline or skill…"
        aria-label="Filter candidates"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        leadingIcon={SearchIcon}
        className="max-w-sm"
      />
      {q.isLoading ? (
        <SkeletonTable rows={5} cols={5} />
      ) : !list.length ? (
        <EmptyState icon={Users} title="No candidates match" description="Broaden your filter or wait for more candidates to connect their evidence." />
      ) : (
        <div className="overflow-hidden rounded-panel border border-line-subtle">
          <table className="w-full text-left" role="grid">
            <thead>
              <tr className="border-b border-line-subtle bg-surface-1/60 text-micro uppercase tracking-caps text-ink-faint">
                <th scope="col" className="px-4 py-3">Candidate</th>
                <th scope="col" className="hidden px-4 py-3 md:table-cell">Evidence</th>
                <th scope="col" className="hidden px-4 py-3 sm:table-cell">Top capability</th>
                <th scope="col" className="px-4 py-3">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-subtle/60">
              {list.map((c) => {
                const topCap = [...c.capabilities].sort((a, b) => b.score - a.score)[0];
                return (
                  <tr key={c.id} className="transition-colors hover:bg-surface-1/60">
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-body-sm font-medium text-ink-hi">{c.name}</p>
                        <p className="text-meta text-ink-muted">{c.headline}</p>
                        <p className="numeric mt-0.5 text-micro text-ink-faint">{c.location} · open: {c.openness}</p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3.5 md:table-cell">
                      <Badge tone={c.evidenceStrength} size="sm" dot>{c.evidenceStrength} · {c.evidenceCount} items</Badge>
                    </td>
                    <td className="hidden px-4 py-3.5 sm:table-cell">
                      {topCap && (
                        <div className="flex items-center gap-2.5">
                          <ScoreRing value={topCap.score} size={34} />
                          <span className="text-body-sm text-ink-hi">{topCap.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <Button to={`/candidates/${c.id}`} size="sm" variant="secondary">View</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
