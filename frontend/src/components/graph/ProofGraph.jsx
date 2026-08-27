import { useMemo, useState, useCallback } from "react";
import Badge from "../ui/Badge";

/**
 * ProofGraph — the product's signature visualization.
 *
 * A DETERMINISTIC LAYERED DAG rendering the pipeline:
 *   Evidence → Skills → Capabilities → Job requirements → Match
 *
 * Layout is columnar with hand-tuned vertical ordering (sorted by score), so
 * edges stay legible. NOT a force-directed blob. Interactions: hover/focus
 * highlights connected paths, click selects + drives the inspector panel.
 * Fully responsive via viewBox; reduced-motion safe (CSS transitions only).
 */

const COL = {
  evidence: { x: 10, w: 168 },
  skill: { x: 250, w: 128 },
  capability: { x: 450, w: 158 },
  requirement: { x: 680, w: 148 },
  match: { x: 900, w: 132 },
};
const ROW_H = 46;
const TOP = 34;

function nodeY(index) {
  return TOP + index * ROW_H;
}

const toneFor = {
  verified: "var(--ph-verified)",
  intel: "var(--ph-intel)",
  signal: "var(--ph-signal)",
  caution: "var(--ph-caution)",
  neutral: "var(--ph-line-strong)",
};

function NodeBox({ node, dimmed, active, onSelect }) {
  const col = COL[node.kind];
  const y = nodeY(node._index);
  const fill = toneFor[node.tone || "neutral"];
  return (
    <g
      role="button"
      tabIndex={-1}
      aria-label={`${node.label}${node.meta ? `, ${node.meta}` : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node);
      }}
      onMouseEnter={() => onSelect(node, true)}
      className="cursor-pointer"
    >
      <rect
        x={col.x}
        y={y}
        width={col.w}
        height={38}
        rx={9}
        className="transition-opacity duration-200"
        style={{
          opacity: dimmed ? 0.25 : 1,
          fill: "hsl(var(--ph-surface-2))",
          stroke: active ? `hsl(${fill})` : `hsl(var(--ph-line-subtle))`,
          strokeWidth: active ? 1.6 : 1,
        }}
      />
      {active && (
        <rect
          x={col.x}
          y={y}
          width={col.w}
          height={38}
          rx={9}
          fill={`hsl(${fill} / 0.08)`}
          className="pointer-events-none"
        />
      )}
      <text
        x={col.x + 12}
        y={y + 15}
        fontSize={10.5}
        fontWeight={600}
        fill="hsl(var(--ph-ink-hi))"
        style={{ opacity: dimmed ? 0.3 : 1 }}
        className="pointer-events-none select-none"
      >
        {truncate(node.label, Math.floor(col.w / 6.4))}
      </text>
      <text
        x={col.x + 12}
        y={y + 28}
        fontSize={9}
        fontFamily="JetBrains Mono Variable, JetBrains Mono, monospace"
        fill={active ? `hsl(${fill})` : "hsl(var(--ph-ink-faint))"}
        style={{ opacity: dimmed ? 0.3 : 1 }}
        className="pointer-events-none select-none"
      >
        {node.meta}
      </text>
    </g>
  );
}

function Edge({ edge, dimmed, flowing }) {
  return (
    <path
      d={edge.d}
      fill="none"
      strokeWidth={flowing ? 1.8 : 1}
      strokeLinecap="round"
      stroke={flowing ? `hsl(var(--ph-intel) / 0.75)` : `hsl(var(--ph-line-strong) / 0.5)`}
      strokeDasharray={flowing ? "none" : undefined}
      className={`transition-all duration-200 ${flowing ? "ph-edge-flow" : ""}`}
      style={{ opacity: dimmed ? 0.12 : 1 }}
    />
  );
}

function truncate(str, n) {
  if (!str) return "";
  return str.length > n ? `${str.slice(0, n - 1)}…` : str;
}

function cubic(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

/**
 * @param evidence [] — demo/live evidence artifacts
 * @param capabilities [] — [{name, score, uncertainty}]
 * @param job — optional job with requirementProfile
 * @param match — optional match for this candidate/job pairing
 * @param onSelectNode — forwarded for external inspector sync
 */
export default function ProofGraph({
  evidence = [],
  capabilities = [],
  job,
  match,
  className = "",
}) {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  // Skills derive from evidence coverage; capabilities come from the model.
  const skills = useMemo(() => {
    const bySkill = new Map();
    evidence.forEach((ev) => {
      ev.skills?.forEach((s) => {
        if (!bySkill.has(s)) bySkill.set(s, []);
        bySkill.get(s).push(ev.id);
      });
    });
    return [...bySkill.entries()]
      .map(([name, ids]) => ({ name, evidenceIds: ids }))
      .sort((a, b) => b.evidenceIds.length - a.evidenceIds.length)
      .slice(0, 7);
  }, [evidence]);

  const requirements = job?.requirementProfile || [];

  const nodes = useMemo(() => {
    const list = [];
    evidence.slice(0, 6).forEach((ev, i) => {
      list.push({
        kind: "evidence",
        id: ev.id,
        label: ev.title.replace(/^.*—\s*/, ""),
        meta: ev.verified ? "verified" : "unverified",
        tone: ev.strength === "strong" ? "verified" : ev.strength === "weak" ? "caution" : "intel",
        ref: ev,
        _index: i,
      });
    });
    skills.forEach((s, i) => {
      list.push({
        kind: "skill",
        id: `skill:${s.name}`,
        label: s.name,
        meta: `${s.evidenceIds.length} source${s.evidenceIds.length === 1 ? "" : "s"}`,
        tone: "signal",
        ref: s,
        _index: i,
      });
    });
    capabilities.slice(0, 6).forEach((c, i) => {
      list.push({
        kind: "capability",
        id: `cap:${c.name}`,
        label: c.name,
        meta: `${c.score}% ±${c.uncertainty}`,
        tone: c.score >= 75 ? "intel" : c.score >= 55 ? "signal" : "caution",
        ref: c,
        _index: i,
      });
    });
    requirements.forEach((r, i) => {
      list.push({
        kind: "requirement",
        id: `req:${r.skill}`,
        label: r.skill,
        meta: `weight ×${r.weight.toFixed(2)} · min ${r.minConfidence}`,
        tone: "neutral",
        ref: r,
        _index: i,
      });
    });
    if (match) {
      list.push({
        kind: "match",
        id: "match:result",
        label: "Match result",
        meta: `${match.score}% ±${match.uncertainty}%`,
        tone: match.score >= 80 ? "verified" : match.score >= 60 ? "intel" : "caution",
        ref: match,
        _index: 0,
      });
    }
    return list;
  }, [evidence, skills, capabilities, requirements, match]);

  const edges = useMemo(() => {
    const out = [];
    const find = (id) => nodes.find((n) => n.id === id);

    // evidence → skill
    nodes.filter((n) => n.kind === "skill").forEach((sk) => {
      sk.ref.evidenceIds.forEach((eid) => {
        const src = find(eid);
        if (!src) return;
        out.push({
          id: `${eid}->${sk.id}`,
          from: eid,
          to: sk.id,
          d: cubic(
            COL.evidence.x + COL.evidence.w,
            nodeY(src._index) + 19,
            COL.skill.x,
            nodeY(sk._index) + 19
          ),
        });
      });
    });

    // skill → capability (string containment heuristic on names)
    nodes.filter((n) => n.kind === "capability").forEach((cap) => {
      nodes.filter((n) => n.kind === "skill").forEach((sk) => {
        const a = cap.ref.name.toLowerCase();
        const b = sk.ref.name.toLowerCase();
        if (a.includes(b.split(" ")[0]) || b.includes(a.split(" ")[0])) {
          out.push({
            id: `${sk.id}->${cap.id}`,
            from: sk.id,
            to: cap.id,
            d: cubic(
              COL.skill.x + COL.skill.w,
              nodeY(sk._index) + 19,
              COL.capability.x,
              nodeY(cap._index) + 19
            ),
          });
        }
      });
    });

    // capability → requirement
    nodes.filter((n) => n.kind === "requirement").forEach((req) => {
      nodes.filter((n) => n.kind === "capability").forEach((cap) => {
        if (cap.ref.name === req.ref.skill) {
          out.push({
            id: `${cap.id}->${req.id}`,
            from: cap.id,
            to: req.id,
            d: cubic(
              COL.capability.x + COL.capability.w,
              nodeY(cap._index) + 19,
              COL.requirement.x,
              nodeY(req._index) + 19
            ),
          });
        }
      });
    });

    // requirement → match
    const m = find("match:result");
    if (m) {
      nodes.filter((n) => n.kind === "requirement").forEach((req) => {
        const satisfied =
          match.matchedSkills?.includes(req.ref.skill) ||
          match.missingSkills?.includes(req.ref.skill);
        if (!satisfied) return;
        out.push({
          id: `${req.id}->${m.id}`,
          from: req.id,
          to: m.id,
          satisfied: match.matchedSkills?.includes(req.ref.skill),
          d: cubic(
            COL.requirement.x + COL.requirement.w,
            nodeY(req._index) + 19,
            COL.match.x,
            nodeY(m._index) + 19
          ),
        });
      });
    }
    return out;
  }, [nodes, match]);

  const focusId = hovered?.id || selected?.id;

  const isEdgeLit = useCallback(
    (edge) => !!focusId && (edge.from === focusId || edge.to === focusId),
    [focusId]
  );
  const isNodeDim = useCallback(
    (node) => {
      if (!focusId) return false;
      if (node.id === focusId) return false;
      return !edges.some(
        (e) =>
          (e.from === focusId && e.to === node.id) ||
          (e.to === focusId && e.from === node.id)
      );
    },
    [focusId, edges]
  );

  const handleSelect = useCallback((node, isHover) => {
    setHovered(isHover ? node : null);
    if (!isHover) setSelected((cur) => (cur?.id === node.id ? null : node));
  }, []);

  const rowsCount = Math.max(
    evidence.slice(0, 6).length,
    skills.length,
    capabilities.slice(0, 6).length,
    requirements.length,
    4
  );

  const active = selected || hovered;

  return (
    <div
      className={`relative overflow-hidden rounded-card border border-line-subtle bg-surface-1/40 ${className}`}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Column headers */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-between px-4 pt-2">
        {["Evidence", "Skills", "Capabilities", ...(requirements.length ? ["Requirements"] : []), ...(match ? ["Match"] : [])].map(
          (label) => (
            <span key={label} className="text-micro font-medium uppercase tracking-caps text-ink-faint">
              {label}
            </span>
          )
        )}
      </div>

      <svg
        viewBox={`0 0 1060 ${TOP + rowsCount * ROW_H + 18}`}
        className="block w-full"
        role="img"
        aria-label="Proof graph linking evidence through skills and capabilities to job requirements and the resulting match"
      >
        {edges.map((edge) => (
          <Edge key={edge.id} edge={edge} dimmed={!!focusId && !isEdgeLit(edge)} flowing={isEdgeLit(edge)} />
        ))}
        {nodes.map((node) => (
          <NodeBox
            key={node.id}
            node={node}
            dimmed={isNodeDim(node)}
            active={focusId === node.id}
            onSelect={handleSelect}
          />
        ))}
      </svg>

      {/* Inspector strip */}
      <div className="border-t border-line-subtle bg-surface-1/70 px-4 py-3">
        {active ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 animate-fade-in">
            <Badge tone="info" size="sm">{active.kind}</Badge>
            <span className="text-body-sm font-medium text-ink-hi">{active.label}</span>
            <span className="numeric font-mono text-micro text-ink-muted">{active.meta}</span>
            {active.kind === "requirement" && match && (
              <span className="text-meta text-ink-muted">
                {match.matchedSkills?.includes(active.ref.skill) ? (
                  <span className="text-verified">✓ evidenced</span>
                ) : (
                  <span className="text-caution">not evidenced in this match</span>
                )}
              </span>
            )}
            {active.kind === "capability" && (
              <span className="text-meta text-ink-muted">
                built from linked evidence · confidence band shown as ±{active.ref.uncertainty}%
              </span>
            )}
          </div>
        ) : (
          <p className="text-meta text-ink-faint">
            Hover or tap a node to trace its provenance path. Every line flows from something real — a repository, an assessment, a merged contribution.
          </p>
        )}
      </div>
    </div>
  );
}
