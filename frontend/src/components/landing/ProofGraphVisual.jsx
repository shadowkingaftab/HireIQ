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
      <div className="panel-glass relative overflow-hidden rounded-card border-line-subtle shadow-raised">
        {/* faint grid backdrop */}
        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full opacity-[0.35]"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="ph-grid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="hsl(var(--ph-line-subtle) / 0.5)" strokeWidth="1" />
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
          className="relative block h-auto w-full"
          onMouseLeave={() => setFocused(null)}
        >
          {/* ordinary edges */}
          <g>
            {EDGES.map(([a, b, faint]) => {
              const { x1, y1, x2, y2 } = edge(a, b);
              const dimmed = active && !PROOF_PATH.some(([p, q]) => (p === a && q === b) || p === active || q === active);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={`hsl(var(--ph-${faint ? "line-strong" : "intel"}) / ${faint ? 0.22 : dimmed ? 0.12 : 0.3})`}
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
                  stroke="hsl(var(--ph-verified) / 0.75)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              );
            })}
          </g>

          {/* nodes */}
          <g>
            {Object.entries(NODES).map(([key, node]) => {
              const isActive = active === key;
              const onPath = PROOF_PATH.some(([p, q]) => p === key || q === key);
              const floatDelay = (Object.keys(NODES).indexOf(key) % 5) * 0.7;
              return (
                <g
                  key={key}
                  tabIndex={0}
                  role="img"
                  aria-label={`${node.label}${node.meta ? ` — ${node.meta}` : ""}`}
                  className="ph-float cursor-default outline-none focus-visible:opacity-100"
                  style={{ animationDelay: `${floatDelay}s`, transformBox: "fill-box", transformOrigin: "center" }}
                  onMouseEnter={() => setFocused(key)}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                >
                  {node.kind === "evidence" && (
                    <>
                      <rect
                        x={node.x - 17} y={node.y - 17} width={34} height={34} rx={9}
                        fill="hsl(var(--ph-surface-2))"
                        stroke={`hsl(var(--ph-${isActive || onPath ? "verified" : "line-strong"}) / ${isActive || onPath ? 0.65 : 0.5})`}
                        strokeWidth={1.2}
                      />
                      <rect
                        x={node.x - 4.5} y={node.y - 4.5} width={9} height={9} rx={2.5}
                        fill={`hsl(var(--ph-${onPath ? "verified" : "ink-faint"}) / ${onPath ? 0.85 : 0.7})`}
                      />
                    </>
                  )}
                  {node.kind === "skill" && (
                    <>
                      <circle
                        cx={node.x} cy={node.y} r={20}
                        fill="hsl(var(--ph-surface-3))"
                        stroke={`hsl(var(--ph-intel) / ${isActive ? 0.8 : onPath ? 0.5 : 0.28})`}
                        strokeWidth={1.2}
                      />
                      <circle cx={node.x} cy={node.y} r={5} fill={`hsl(var(--ph-intel) / ${onPath || isActive ? 0.9 : 0.45})`} />
                    </>
                  )}
                  {node.kind === "core" && (
                    <>
                      <circle cx={node.x} cy={node.y} r={40} fill="none" stroke="hsl(var(--ph-intel) / 0.18)" strokeWidth={10} />
                      <circle
                        cx={node.x} cy={node.y} r={30}
                        fill="hsl(var(--ph-intel-soft))"
                        stroke="hsl(var(--ph-intel) / 0.6)"
                        strokeWidth={1.4}
                      />
                      <text
                        x={node.x} y={node.y + 4}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono Variable', monospace"
                        fontSize={11}
                        fontWeight={700}
                        fill="hsl(var(--ph-intel))"
                      >
                        CAP
                      </text>
                    </>
                  )}
                  {node.kind === "match" && (
                    <>
                      <rect
                        x={node.x - 44} y={node.y - 26} width={88} height={52} rx={14}
                        fill="hsl(var(--ph-verified-soft))"
                        stroke="hsl(var(--ph-verified) / 0.55)"
                        strokeWidth={1.4}
                      />
                      <text
                        x={node.x} y={node.y - 2}
                        textAnchor="middle"
                        fontFamily="'JetBrains Mono Variable', monospace"
                        fontSize={16}
                        fontWeight={700}
                        fill="hsl(var(--ph-verified))"
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
                  {(node.kind !== "match") && (
                    <text
                      x={
                        node.kind === "evidence"
                          ? node.x
                          : node.kind === "core"
                            ? node.x
                            : node.x
                      }
                      y={node.kind === "core" ? node.y + 58 : node.y + (node.kind === "evidence" ? 32 : 36)}
                      textAnchor="middle"
                      fontSize={node.kind === "core" ? 12 : 11}
                      fontWeight={isActive || onPath ? 600 : 500}
                      fill={`hsl(var(--ph-${isActive || onPath ? "ink-hi" : "ink-med"}))`}
                    >
                      {node.label}
                    </text>
                  )}
                  {node.meta && (
                    <text
                      x={node.x}
                      y={node.y + (node.kind === "evidence" ? 46 : 50)}
                      textAnchor="middle"
                      fontSize={9}
                      fill="hsl(var(--ph-ink-faint))"
                      fontFamily="'JetBrains Mono Variable', monospace"
                    >
                      {node.meta}
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
