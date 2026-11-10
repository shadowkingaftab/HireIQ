import { useEffect, useId, useRef, useState } from "react";
import { LOGOS } from "./constellationLogos";

/* -------------------------------------------------------
   CONSTELLATION (hero background layer)

   A star chart of the person's proof. Every logo is a star,
   the asterism lines join them, and everything ultimately
   connects to the glowing orb on the horizon: the profile.
   Left arm = verified platforms (cool), right arm = skills
   (warm), matching the blue / orange flame behind it.

   Geometry is in CSS px, measured from the horizontal centre
   and from the BOTTOM of the hero, so the hub always sits on the
   horizon, below the stats row. Nodes drift slowly, the lines
   follow them, and light pulses run from each skill to the hub.
------------------------------------------------------- */

const W = 2000;
const H = 920;
const PANEL = "#06111B";

const SIDE = {
  L: { line: "#9CCBFF", halo: "#0297DE", spark: "#BFE0FF" },
  R: { line: "#FFC2A6", halo: "#FC734D", spark: "#FFD2BC" },
};

// The chart is authored with the hub at b = 322; DROP lowers all of it so the hub
// ends up at b = 160, on the horizon.
const DROP = 162;

// b = distance above the bottom edge of the hero (before DROP)
const star = (id, x, b, r, side) => ({
  id,
  kind: "star",
  x,
  y: H - (b - DROP),
  r,
  side,
});
const logo = (id, label, x, b, r, side) => ({
  id,
  kind: "logo",
  label,
  logo: id,
  x,
  y: H - (b - DROP),
  r,
  side,
});

const HUB = { id: "hub", kind: "hub", x: 0, y: H - 160, r: 32, side: "L" };

const NODES = [
  HUB,

  /* ---- left arm: verified platforms (core logos stay within +-740px) ---- */
  star("l1", -215, 338, 2.4, "L"),
  star("l2", -425, 314, 2.2, "L"),
  logo("github", "GitHub", -540, 450, 29, "L"),
  logo("leetcode", "LeetCode", -690, 340, 27, "L"),
  logo("hackerrank", "HackerRank", -682, 505, 26, "L"),
  logo("linkedin", "LinkedIn", -615, 618, 27, "L"),
  logo("codeforces", "Codeforces", -510, 745, 25, "L"),
  logo("codechef", "CodeChef", -880, 430, 25, "L"), // wide screens only
  star("ls1", -470, 580, 2, "L"),
  star("ls3", -860, 640, 2.2, "L"),
  star("ls4", -735, 700, 1.8, "L"),
  star("ls5", -420, 650, 1.8, "L"),
  star("ls6", -950, 320, 1.8, "L"),

  /* ---- right arm: skills ---- */
  star("r1", 232, 330, 2.4, "R"),
  star("r2", 448, 322, 2.2, "R"),
  logo("python", "Python", 535, 452, 31, "R"),
  logo("javascript", "JavaScript", 680, 336, 27, "R"),
  logo("mysql", "MySQL", 690, 505, 26, "R"),
  logo("react", "React", 625, 610, 27, "R"),
  logo("node", "Node.js", 520, 745, 25, "R"),
  logo("typescript", "TypeScript", 668, 742, 24, "R"),
  logo("git", "Git", 840, 410, 24, "R"), // wide screens only
  logo("docker", "Docker", 850, 640, 25, "R"),
  logo("tailwind", "Tailwind", 960, 520, 22, "R"),
  star("rs1", 478, 585, 2, "R"),
  star("rs2", 622, 490, 2.6, "R"),
  star("rs4", 640, 690, 1.8, "R"),
  star("rs5", 905, 330, 2, "R"),
  star("rs6", 598, 388, 1.8, "R"),
  star("rs7", 425, 660, 1.8, "R"),
];

const EDGES = [
  // left arm
  ["hub", "l1"], ["l1", "l2"], ["l2", "github"], ["l2", "leetcode"],
  ["github", "leetcode"], ["github", "hackerrank"], ["leetcode", "hackerrank"],
  ["github", "ls1"], ["ls1", "linkedin"], ["hackerrank", "linkedin"],
  ["linkedin", "ls4"], ["ls4", "codeforces"], ["linkedin", "ls5"],
  ["hackerrank", "codechef"], ["codechef", "ls6"], ["codechef", "ls3"],
  // right arm
  ["hub", "r1"], ["r1", "r2"], ["r2", "python"], ["r2", "javascript"],
  ["python", "rs2"], ["rs2", "mysql"], ["javascript", "mysql"],
  ["javascript", "rs6"], ["rs6", "python"], ["python", "rs1"],
  ["rs1", "react"], ["mysql", "react"], ["react", "rs4"],
  ["rs4", "typescript"], ["react", "node"], ["node", "rs7"],
  ["mysql", "git"], ["git", "docker"], ["git", "tailwind"], ["git", "rs5"],
];

// Lines touching the hub or the horizon relays are the "trunk" and get more weight,
// so they stay readable against the bright flame.
const TRUNK = new Set(["hub", "l1", "l2", "r1", "r2"]);

/* -------------------------------------------------------
   GRAPH PREP (module scope, runs once)
------------------------------------------------------- */

const INDEX = Object.fromEntries(NODES.map((n, i) => [n.id, i]));
const EDGE_LIST = EDGES.map(([a, b], k) => ({
  k,
  a: INDEX[a],
  b: INDEX[b],
  trunk: TRUNK.has(a) && TRUNK.has(b),
  side: NODES[INDEX[a] === 0 ? INDEX[b] : INDEX[a]].side,
}));

// Gap left between a line end and the star it points at.
const gapOf = (n) =>
  n.kind === "hub" ? 46 : n.kind === "logo" ? n.r + 9 : n.r + 5;

// BFS from the hub: parent node + connecting edge for every node.
const PARENT = new Array(NODES.length).fill(-1);
const PARENT_EDGE = new Array(NODES.length).fill(-1);
{
  const adj = NODES.map(() => []);
  EDGE_LIST.forEach((e) => {
    adj[e.a].push([e.b, e.k]);
    adj[e.b].push([e.a, e.k]);
  });
  const seen = new Set([0]);
  const queue = [0];
  while (queue.length) {
    const cur = queue.shift();
    adj[cur].forEach(([nxt, k]) => {
      if (!seen.has(nxt)) {
        seen.add(nxt);
        PARENT[nxt] = cur;
        PARENT_EDGE[nxt] = k;
        queue.push(nxt);
      }
    });
  }
}

const pathToHub = (i) => {
  const nodes = [i];
  const edges = [];
  while (PARENT[nodes[nodes.length - 1]] !== -1) {
    const cur = nodes[nodes.length - 1];
    edges.push(PARENT_EDGE[cur]);
    nodes.push(PARENT[cur]);
  }
  return { nodes, edges };
};

const LOGO_IDX = NODES.map((n, i) => (n.kind === "logo" ? i : -1)).filter(
  (i) => i >= 0
);

// Per-node drift: small, slow, different for every node.
const DRIFT = NODES.map((n, i) =>
  n.kind === "hub"
    ? null
    : {
        ax: 2.5 + ((i * 5) % 4) * 1.3,
        ay: 2.5 + ((i * 3) % 4) * 1.3,
        fx: 0.22 + ((i * 7) % 5) * 0.035,
        fy: 0.19 + ((i * 11) % 5) * 0.03,
        ph: i * 1.7,
      }
);

function linePoints(a, b, pa, pb) {
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const d = Math.hypot(dx, dy) || 1;
  const ga = gapOf(a);
  const gb = gapOf(b);
  if (d <= ga + gb + 2) return [pa.x, pa.y, pa.x, pa.y];
  const ux = dx / d;
  const uy = dy / d;
  return [pa.x + ux * ga, pa.y + uy * ga, pb.x - ux * gb, pb.y - uy * gb];
}

const BASE = NODES.map((n) => ({ x: n.x, y: n.y }));

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

function ConstellationStyles() {
  return (
    <style>{`
      @keyframes cs-twinkle { 0%, 100% { opacity: 0.35; } 50% { opacity: 1; } }
      @keyframes cs-flow { to { stroke-dashoffset: -40; } }
      @keyframes cs-spin { to { transform: rotate(360deg); } }
      @keyframes cs-breathe { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }

      .cs-twinkle { animation: cs-twinkle 3.8s ease-in-out infinite; }
      .cs-flow { stroke-dasharray: 5 7; animation: cs-flow 1.4s linear infinite; }
      .cs-ring { animation: cs-spin 40s linear infinite; }
      .cs-sun { animation: cs-breathe 5s ease-in-out infinite; }

      .cs-line { transition: stroke-opacity 0.35s, stroke-width 0.35s; }
      .cs-logo { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
      .cs-node:hover .cs-logo { transform: scale(1.14); }

      @media (prefers-reduced-motion: reduce) {
        .cs-twinkle, .cs-flow, .cs-ring, .cs-sun { animation: none; }
        .cs-logo, .cs-line { transition: none; }
      }
    `}</style>
  );
}

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */

export default function Constellation({ profile = {} }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = `cs${uid}`;
  const [active, setActive] = useState(-1);

  const svgRef = useRef(null);
  const nodeEls = useRef([]);
  const lineEls = useRef([]);
  const pulseEls = useRef([]);

  const lit = active >= 0 ? pathToHub(active) : null;
  const litEdges = lit ? new Set(lit.edges) : null;

  /* drift + pulses -------------------------------------- */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pos = BASE.map((p) => ({ ...p }));
    const pulses = [0, 1, 2].map(() => ({ on: false, path: [], t0: 0, dur: 3 }));
    let nextSpawn = 0.8;
    let raf = 0;
    let last = 0;
    let onScreen = true;
    const t0 = performance.now();

    const apply = (t, still) => {
      NODES.forEach((n, i) => {
        const d = DRIFT[i];
        if (d && !still) {
          pos[i].x = n.x + d.ax * Math.sin(t * d.fx + d.ph);
          pos[i].y = n.y + d.ay * Math.cos(t * d.fy + d.ph * 1.3);
        } else {
          pos[i].x = n.x;
          pos[i].y = n.y;
        }
        const el = nodeEls.current[i];
        if (el) {
          el.setAttribute(
            "transform",
            `translate(${pos[i].x.toFixed(2)} ${pos[i].y.toFixed(2)})`
          );
        }
      });

      EDGE_LIST.forEach((e) => {
        const el = lineEls.current[e.k];
        if (!el) return;
        const [x1, y1, x2, y2] = linePoints(
          NODES[e.a],
          NODES[e.b],
          pos[e.a],
          pos[e.b]
        );
        el.setAttribute("x1", x1.toFixed(2));
        el.setAttribute("y1", y1.toFixed(2));
        el.setAttribute("x2", x2.toFixed(2));
        el.setAttribute("y2", y2.toFixed(2));
      });

      if (still) return;

      // light pulses travelling leaf -> hub along the live positions
      if (t >= nextSpawn) {
        const free = pulses.find((p) => !p.on);
        if (free) {
          const leaf = LOGO_IDX[Math.floor(Math.random() * LOGO_IDX.length)];
          free.on = true;
          free.path = pathToHub(leaf).nodes;
          free.t0 = t;
          free.dur = 2.4 + 0.55 * (free.path.length - 1);
          free.side = NODES[leaf].side;
        }
        nextSpawn = t + 1.3 + Math.random() * 1.4;
      }

      pulses.forEach((p, k) => {
        const el = pulseEls.current[k];
        if (!el) return;
        const u = (t - p.t0) / p.dur;
        if (!p.on || u >= 1) {
          p.on = false;
          el.setAttribute("opacity", "0");
          return;
        }
        const pts = p.path.map((i) => pos[i]);
        let total = 0;
        const segs = [];
        for (let s = 0; s < pts.length - 1; s += 1) {
          const l = Math.hypot(pts[s + 1].x - pts[s].x, pts[s + 1].y - pts[s].y);
          segs.push(l);
          total += l;
        }
        let dist = (u * u * (3 - 2 * u)) * total;
        let s = 0;
        while (s < segs.length - 1 && dist > segs[s]) {
          dist -= segs[s];
          s += 1;
        }
        const f = segs[s] ? Math.min(dist / segs[s], 1) : 0;
        const x = pts[s].x + (pts[s + 1].x - pts[s].x) * f;
        const y = pts[s].y + (pts[s + 1].y - pts[s].y) * f;
        el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        el.setAttribute("opacity", String(Math.min(1, u * 7, (1 - u) * 5)));
        el.setAttribute("fill", SIDE[p.side].spark);
      });
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30 fps is plenty for slow drift
      last = now;
      apply((now - t0) / 1000, false);
    };

    const start = () => {
      if (!raf && onScreen && !document.hidden && !motion.matches) {
        raf = requestAnimationFrame(loop);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMotion = () => {
      stop();
      pulseEls.current.forEach((el) => el && el.setAttribute("opacity", "0"));
      apply(0, motion.matches);
      start();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(svg);

    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);

    apply(0, true);
    start();

    return () => {
      stop();
      io.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  /* render ---------------------------------------------- */
  const hubAvatar = profile.avatarSrc;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      viewBox={`${-W / 2} 0 ${W} ${H}`}
      width={W}
      height={H}
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{ width: W, height: H, maxWidth: "none", pointerEvents: "none" }}
    >
      <ConstellationStyles />

      <defs>
        {["L", "R"].map((s) => (
          <radialGradient key={s} id={`${id}-halo${s}`}>
            <stop offset="0" stopColor={SIDE[s].halo} stopOpacity="0.38" />
            <stop offset="0.6" stopColor={SIDE[s].halo} stopOpacity="0.1" />
            <stop offset="1" stopColor={SIDE[s].halo} stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient id={`${id}-sun`}>
          <stop offset="0" stopColor="#FFF1E8" stopOpacity="0.85" />
          <stop offset="0.25" stopColor="#FFC9A8" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#FF8A5E" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FF8A5E" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-orb`}>
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="0.45" stopColor="#FFE6D6" />
          <stop offset="0.85" stopColor="#FFA77A" />
          <stop offset="1" stopColor="#FF8A5E" />
        </radialGradient>
        <radialGradient id={`${id}-spark`}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${id}-avatar`}>
          <circle r="29" />
        </clipPath>
      </defs>

      {/* ASTERISM LINES */}
      <g fill="none" strokeLinecap="round">
        {EDGE_LIST.map((e) => {
          const on = litEdges ? litEdges.has(e.k) : false;
          const [x1, y1, x2, y2] = linePoints(
            NODES[e.a],
            NODES[e.b],
            BASE[e.a],
            BASE[e.b]
          );
          return (
            <line
              key={e.k}
              ref={(el) => {
                lineEls.current[e.k] = el;
              }}
              className={`cs-line${on ? " cs-flow" : ""}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={SIDE[e.side].line}
              strokeOpacity={on ? 1 : litEdges ? 0.12 : e.trunk ? 0.95 : 0.5}
              strokeWidth={on ? 1.9 : e.trunk ? 2 : 1.2}
            />
          );
        })}
      </g>

      {/* NODES */}
      {NODES.map((n, i) => {
        if (n.kind === "hub") return null;

        if (n.kind === "star") {
          return (
            <g
              key={n.id}
              ref={(el) => {
                nodeEls.current[i] = el;
              }}
              transform={`translate(${n.x} ${n.y})`}
            >
              <circle r={n.r * 5} fill={`url(#${id}-spark)`} opacity="0.45" />
              <g className="cs-twinkle" style={{ animationDelay: `${(i * 0.7) % 4}s` }}>
                <circle r={n.r} fill={SIDE[n.side].spark} />
              </g>
            </g>
          );
        }

        const s = n.r * 1.28;
        return (
          <g
            key={n.id}
            ref={(el) => {
              nodeEls.current[i] = el;
            }}
            transform={`translate(${n.x} ${n.y})`}
            className="cs-node"
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
          >
            <g className="cs-logo">
              <circle r={n.r + 20} fill={`url(#${id}-halo${n.side})`} />
              <circle
                r={n.r}
                fill={PANEL}
                fillOpacity="0.78"
                stroke={SIDE[n.side].line}
                strokeOpacity={active === i ? 0.9 : 0.3}
                strokeWidth="1.2"
                pointerEvents="all"
              />
              <image
                href={LOGOS[n.logo]}
                x={-s / 2}
                y={-s / 2}
                width={s}
                height={s}
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                y={n.r + 17}
                textAnchor="middle"
                className="font-mono"
                fontSize="10.5"
                letterSpacing="1.6"
                fill="#DCE8FF"
                fillOpacity={active === i ? 1 : 0.62}
                stroke="#02070A"
                strokeWidth="3"
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {n.label.toUpperCase()}
              </text>
            </g>
          </g>
        );
      })}

      {/* PULSES (leaf -> hub) */}
      {[0, 1, 2].map((k) => (
        <g
          key={k}
          ref={(el) => {
            pulseEls.current[k] = el;
          }}
          opacity="0"
          fill="#fff"
        >
          <circle r="9" opacity="0.28" />
          <circle r="2.6" />
        </g>
      ))}

      {/* HUB: the profile, a luminous orb on the horizon */}
      <g
        ref={(el) => {
          nodeEls.current[0] = el;
        }}
        transform={`translate(${HUB.x} ${HUB.y})`}
      >
        <circle r="150" fill={`url(#${id}-sun)`} className="cs-sun" />
        <circle
          className="cs-ring"
          r="44"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.35"
          strokeDasharray="2 6"
        />
        <circle r="38" fill="none" stroke="#fff" strokeOpacity="0.16" />
        {hubAvatar ? (
          <g>
            <circle r="32" fill={PANEL} stroke="#fff" strokeOpacity="0.85" strokeWidth="1.5" />
            <image
              href={hubAvatar}
              x="-29"
              y="-29"
              width="58"
              height="58"
              preserveAspectRatio="xMidYMid slice"
              clipPath={`url(#${id}-avatar)`}
            />
          </g>
        ) : (
          <circle r="30" fill={`url(#${id}-orb)`} />
        )}
      </g>
    </svg>
  );
}
