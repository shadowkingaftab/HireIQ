import { useState } from "react";

/**
 * ProofGraphVisual — landing demonstration of the ProofHire intelligence
 * layer: evidence → skills → capability → match.
 *
 * Deliberately a curated, static-layout SVG (not the production skill-graph
 * engine): positions are art-directed so the flow reads left to right,
 * motion is a gentle ambient drift, and one "proof path" is highlighted as
 * it flows from an assessment through skills to a match score. Hover and
 * keyboard focus reveal node context. All data is demonstrative.
 */

const NODES = {
  // Evidence layer (left)
  repo: { x: 110, y: 96, kind: "evidence", label: "Repository", meta: "payments-core" },
  assessment: { x: 110, y: 258, kind: "evidence", label: "Assessment", meta: "Algorithms · 91" },
  activity: { x: 110, y: 420, kind: "evidence", label: "Contributions", meta: "24 months consistent" },
  // Skill layer (middle)
  python: { x: 372, y: 120, kind: "skill", label: "Python" },
  fastapi: { x: 372, y: 232, kind: "skill", label: "FastAPI" },
  postgres: { x: 372, y: 344, kind: "skill", label: "PostgreSQL" },
  docker: { x: 372, y: 456, kind: "skill", label: "Docker" },
  // Capability + match (right)
  core: { x: 596, y: 288, kind: "core", label: "Backend Capability" },
  match: { x: 764, y: 288, kind: "match", label: "Match 94" },
};

const EDGES = [
  ["repo", "python"],
  ["repo", "fastapi"],
  ["repo", "docker", true],
  ["assessment", "python"],
  ["assessment", "postgres"],
  ["activity", "python", true],
  ["activity", "fastapi", true],
  ["activity", "postgres", true],
  ["activity", "docker", true],
  ["python", "core"],
  ["fastapi", "core"],
  ["postgres", "core"],
  ["docker", "core", true],
];

/** The highlighted proof path: assessment → Python → capability → match. */
const PROOF_PATH = [
  ["assessment", "python"],
  ["python", "core"],
  ["core", "match"],
];

function edge(a, b) {
  const A = NODES[a];
  const B = NODES[b];
  return { x1: A.x, y1: A.y, x2: B.x, y2: B.y };
}

export default function ProofGraphVisual() {
  const [focused, setFocused] = useState(null);
  const active = focused;

  return (
    <figure
      className="relative w-full"
      role="figure"
      aria-label="Demonstration of how ProofHire links evidence such as repositories and assessments to verified skills, then to a candidate capability and a match score."
    >
      <div className="hero-graph relative overflow-hidden">
        {/* faint grid backdrop */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-[0.14]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="ph-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="hsl(var(--ph-ink-faint) / 0.55)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ph-grid)" />
        </svg>

        <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-line-subtle bg-surface-1/80 px-3 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verified" aria-hidden="true" />
          <span className="text-micro font-medium uppercase tracking-caps text-ink-muted">
            Demonstration data
          </span>
        </div>

        <svg
          viewBox="0 0 860 552"
          className="ph-float relative block h-auto w-full"
          onMouseLeave={() => setFocused(null)}
        >
          <defs>
            <filter id="ph-cyan-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="ph-core-gradient">
              <stop offset="0%" stopColor="hsl(var(--ph-intel))" />
              <stop offset="100%" stopColor="hsl(var(--ph-intel-firm))" />
            </radialGradient>
          </defs>
          {/* ordinary edges */}
          <g>
            {EDGES.map(([a, b, faint]) => {
              const { x1, y1, x2, y2 } = edge(a, b);
              const dimmed = active && !PROOF_PATH.some(([p, q]) => (p === a && q === b) || p === active || q === active);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={`hsl(var(--ph-${faint ? "line-strong" : "intel"}) / ${faint ? 0.16 : dimmed ? 0.12 : 0.28})`}
                  strokeWidth={1.2}
                />
              );
            })}
          </g>

          {/* highlighted proof path */}
          <g>
            {PROOF_PATH.map(([a, b]) => {
              const { x1, y1, x2, y2 } = edge(a, b);
              return (
                <line
                  key={`proof-${a}-${b}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  className="ph-edge-flow"
                  stroke="hsl(var(--ph-intel) / 0.78)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  filter="url(#ph-cyan-glow)"
                />
              );
            })}
          </g>

          <circle
            r="3.5"
            fill="hsl(var(--ph-intel))"
            filter="url(#ph-cyan-glow)"
            className="ph-data-pulse"
            style={{
              offsetPath: 'path("M 110 258 L 372 120 L 596 288 L 764 288")',
            }}
            aria-hidden="true"
          />

          {/* nodes */}
          <g>
            {Object.entries(NODES).map(([key, node]) => {
              const isActive = active === key;
              const onPath = PROOF_PATH.some(([p, q]) => p === key || q === key);
              return (
                <g
                  key={key}
                  tabIndex={0}
                  role="img"
                  aria-label={`${node.label}${node.meta ? ` — ${node.meta}` : ""}`}
                  className="cursor-default outline-none focus-visible:opacity-100"
                  onMouseEnter={() => setFocused(key)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                >
                  {node.kind === "evidence" && (
                    <>
                      <rect
                        x={node.x - 86} y={node.y - 26} width={172} height={52} rx={14}
                        fill="hsl(var(--ph-surface-1) / 0.62)"
                        stroke={`hsl(var(--ph-${isActive || onPath ? "verified" : "line-strong"}) / ${isActive || onPath ? 0.65 : 0.5})`}
                        strokeWidth={1.2}
                      />
                      <circle
                        cx={node.x - 67} cy={node.y - 7} r="3.5"
                        fill={`hsl(var(--ph-${onPath ? "intel" : "ink-faint"}) / ${onPath ? 0.9 : 0.7})`}
                      />
                      <text
                        x={node.x - 57} y={node.y - 4}
                        fontSize={10}
                        fontWeight={600}
                        fill="hsl(var(--ph-ink-hi))"
                      >
                        {node.label}
                      </text>
                      <text
                        x={node.x - 57} y={node.y + 12}
                        fontSize={8}
                        fill="hsl(var(--ph-ink-muted))"
                        fontFamily="'JetBrains Mono Variable', monospace"
                      >
                        {node.meta}
                      </text>
                    </>
                  )}
                  {node.kind === "skill" && (
                    <>
                      <rect
                        x={node.x - 64} y={node.y - 21} width={128} height={42} rx={13}
                        fill="hsl(var(--ph-surface-1) / 0.58)"
                        stroke={`hsl(var(--ph-intel) / ${isActive ? 0.8 : onPath ? 0.52 : 0.35})`}
                        strokeWidth={1.2}
                      />
                      <circle cx={node.x - 43} cy={node.y} r={3.5} fill={`hsl(var(--ph-intel) / ${onPath || isActive ? 0.9 : 0.55})`} />
                      <text
                        x={node.x - 32} y={node.y + 4}
                        fontSize={10}
                        fontWeight={isActive || onPath ? 600 : 500}
                        fill={`hsl(var(--ph-${isActive || onPath ? "ink-hi" : "ink-med"}))`}
                      >
                        {node.label}
                      </text>
                    </>
                  )}
                  {node.kind === "core" && (
                    <>
                      <circle cx={node.x} cy={node.y} r={40} fill="none" stroke="hsl(var(--ph-intel) / 0.2)" strokeWidth={10} filter="url(#ph-cyan-glow)" />
                      <circle
                        cx={node.x} cy={node.y} r={30}
                        fill="url(#ph-core-gradient)"
                        stroke="hsl(var(--ph-intel) / 0.6)"
                        strokeWidth={1.4}
                        filter="url(#ph-cyan-glow)"
                      />
                      <text
                        x={node.x} y={node.y + 4}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono Variable', monospace"
                        fontSize={11}
                        fontWeight={700}
                        fill="hsl(var(--ph-ink-hi))"
                      >
                        CAP
                      </text>
                    </>
                  )}
                  {node.kind === "match" && (
                    <>
                      <rect
                        x={node.x - 44} y={node.y - 26} width={88} height={52} rx={14}
                        fill="hsl(var(--ph-accent) / 0.12)"
                        stroke="hsl(var(--ph-accent) / 0.9)"
                        strokeWidth={1.4}
                        filter="url(#ph-cyan-glow)"
                      />
                      <text
                        x={node.x} y={node.y - 2}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono Variable', monospace"
                        fontSize={16}
                        fontWeight={700}
                        fill="hsl(var(--ph-accent))"
                      >
                        94
                      </text>
                      <text
                        x={node.x} y={node.y + 15}
                        textAnchor="middle"
                        fontSize={8.5}
                        letterSpacing={1.5}
                        fill="hsl(var(--ph-ink-muted))"
                      >
                        MATCH
                      </text>
                    </>
                  )}
                  {/* labels */}
                  {node.kind === "core" && (
                    <text
                      x={node.x}
                      y={node.y + 58}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={isActive || onPath ? 600 : 500}
                      fill={`hsl(var(--ph-${isActive || onPath ? "ink-hi" : "ink-med"}))`}
                    >
                      {node.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* layer captions */}
          <g aria-hidden="true" fill="hsl(var(--ph-ink-faint))" fontSize={9.5} letterSpacing={2}>
            <text x={110} y={26} textAnchor="middle">EVIDENCE</text>
            <text x={372} y={26} textAnchor="middle">VERIFIED SKILLS</text>
            <text x={596} y={26} textAnchor="middle">CAPABILITY</text>
            <text x={764} y={26} textAnchor="middle">MATCH</text>
          </g>
        </svg>
      </div>
      <figcaption className="mt-3 text-center text-micro text-ink-faint">
        Illustration with demonstration data — every signal in ProofHire traces back to verifiable evidence.
      </figcaption>
    </figure>
  );
}
