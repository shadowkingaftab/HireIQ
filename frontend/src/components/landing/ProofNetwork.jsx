import { useId, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  SiCodechef,
  SiCodeforces,
  SiDocker,
  SiHackerrank,
  SiJavascript,
  SiLeetcode,
  SiMysql,
  SiNodedotjs,
  SiPython,
  SiReact,
} from "react-icons/si";

/* -------------------------------------------------------
   PROOF NETWORK
   A hub-and-spoke "constellation": the person's profile (or
   your logo) sits in the middle, wired to the platforms that
   verify their work (inner orbit) and the skills those
   platforms evidence (outer orbit).

   Install once:  npm i react-icons

   Props
     profile  { name, role, avatarSrc }   avatarSrc optional;
              without it the Proof Core mark is shown
     nodes    [{ id, label, ring: "inner" | "outer",
                 Icon, color, href }]    see DEFAULT_NODES
     heading / subheading                 pass null to hide
------------------------------------------------------- */

const SIZE = 800;
const C = SIZE / 2;
const BLUE = "#0297DE";
const ORANGE = "#FC734D";
const PANEL = "#06111B";
const MIDNIGHT = "#02070A";

const RING = {
  inner: { radius: 190, node: 32, icon: 26, accent: BLUE },
  outer: { radius: 305, node: 28, icon: 22, accent: ORANGE },
};

// Replace href with the person's own profile URLs.
const DEFAULT_NODES = [
  { id: "github", label: "GitHub", ring: "inner", Icon: FaGithub, color: "#F0F6FC", href: "https://github.com" },
  { id: "linkedin", label: "LinkedIn", ring: "inner", Icon: FaLinkedin, color: "#4DA3E8", href: "https://linkedin.com" },
  { id: "leetcode", label: "LeetCode", ring: "inner", Icon: SiLeetcode, color: "#FFA116", href: "https://leetcode.com" },
  { id: "codechef", label: "CodeChef", ring: "inner", Icon: SiCodechef, color: "#D9B38C", href: "https://codechef.com" },
  { id: "hackerrank", label: "HackerRank", ring: "inner", Icon: SiHackerrank, color: "#2EC866", href: "https://hackerrank.com" },
  { id: "codeforces", label: "Codeforces", ring: "inner", Icon: SiCodeforces, color: "#5BA9F5", href: "https://codeforces.com" },

  { id: "python", label: "Python", ring: "outer", Icon: SiPython, color: "#FFD43B" },
  { id: "react", label: "React", ring: "outer", Icon: SiReact, color: "#61DAFB" },
  { id: "javascript", label: "JavaScript", ring: "outer", Icon: SiJavascript, color: "#F7DF1E" },
  { id: "node", label: "Node.js", ring: "outer", Icon: SiNodedotjs, color: "#6CC24A" },
  { id: "mysql", label: "MySQL", ring: "outer", Icon: SiMysql, color: "#5BA3D0" },
  { id: "docker", label: "Docker", ring: "outer", Icon: SiDocker, color: "#4DB3F5" },
];

const DEFAULT_PROFILE = {
  name: "Candidate",
  role: "Verified profile",
  avatarSrc: null,
};

/* -------------------------------------------------------
   LAYOUT HELPERS
------------------------------------------------------- */

function angDiff(a, b) {
  return Math.abs((((a - b) % 360) + 540) % 360 - 180);
}

// Inner nodes start half a step off the vertical axis so the profile
// label has room; outer nodes start at the top, staggered between them.
function placeNodes(nodes) {
  const byRing = { inner: [], outer: [] };
  nodes.forEach((n) => byRing[n.ring === "outer" ? "outer" : "inner"].push(n));

  const nInner = Math.max(byRing.inner.length, 1);
  const placed = [];

  ["inner", "outer"].forEach((ring) => {
    const list = byRing[ring];
    const step = 360 / Math.max(list.length, 1);
    const start = ring === "inner" ? -90 + 180 / nInner : -90;

    list.forEach((n, i) => {
      const angle = start + step * i;
      const rad = (angle * Math.PI) / 180;
      const { radius } = RING[ring];
      placed.push({
        ...n,
        ring,
        angle,
        x: C + radius * Math.cos(rad),
        y: C + radius * Math.sin(rad),
      });
    });
  });

  return placed;
}

// Each outer node is also wired to its two nearest inner nodes,
// which forms the triangle mesh between the orbits.
function meshLinks(placed) {
  const inner = placed.filter((n) => n.ring === "inner");
  const outer = placed.filter((n) => n.ring === "outer");
  const links = [];

  outer.forEach((o) => {
    [...inner]
      .sort((p, q) => angDiff(p.angle, o.angle) - angDiff(q.angle, o.angle))
      .slice(0, 2)
      .forEach((p) => links.push({ a: o, b: p }));
  });

  return links;
}

// Deterministic, so server and client render the same stars.
const STARS = Array.from({ length: 48 }, (_, i) => {
  const f = (k, m) => {
    const v = Math.sin(i * k) * m;
    return v - Math.floor(v);
  };
  const a = f(12.9898, 43758.5453);
  const b = f(78.233, 12543.1235);
  const c = f(39.346, 24634.6345);
  return { x: -80 + a * 960, y: -80 + b * 960, r: 0.6 + c * 1.1, d: (a * 7) % 5 };
});

/* -------------------------------------------------------
   STYLES
------------------------------------------------------- */

function NetworkStyles() {
  return (
    <style>{`
      @keyframes pn-dash { to { stroke-dashoffset: -480; } }
      @keyframes pn-spin { to { transform: rotate(360deg); } }
      @keyframes pn-twinkle { 0%, 100% { opacity: 0.15; } 50% { opacity: 0.9; } }
      @keyframes pn-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

      .pn-dash { animation: pn-dash 36s linear infinite; }
      .pn-sat-a { transform-origin: 400px 400px; animation: pn-spin 48s linear infinite; }
      .pn-sat-b { transform-origin: 400px 400px; animation: pn-spin 80s linear infinite reverse; }
      .pn-star { animation: pn-twinkle 4s ease-in-out infinite; }
      .pn-core { animation: pn-pulse 4.5s ease-in-out infinite; }

      .pn-node { outline: none; cursor: pointer; }
      .pn-node-inner { transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
      .pn-node:hover .pn-node-inner,
      .pn-node:focus-visible .pn-node-inner { transform: scale(1.14); }
      .pn-node:focus-visible .pn-ring { stroke-width: 3; stroke-opacity: 1; }
      .pn-label { transition: opacity 0.25s; }

      @media (max-width: 640px) {
        .pn-label { opacity: 0; }
        .pn-node:hover .pn-label,
        .pn-node:focus-visible .pn-label { opacity: 1; }
      }

      @media (prefers-reduced-motion: reduce) {
        .pn-dash, .pn-sat-a, .pn-sat-b, .pn-star, .pn-core { animation: none; }
        .pn-packet { display: none; }
        .pn-node-inner { transition: none; }
      }
    `}</style>
  );
}

/* -------------------------------------------------------
   HUB (profile / logo)
------------------------------------------------------- */

function Hub({ id, profile }) {
  const name =
    profile.name && profile.name.length > 16
      ? `${profile.name.slice(0, 15)}…`
      : profile.name;

  return (
    <g>
      {/* blue + orange bloom, echoing the hero glow */}
      <circle cx={C - 26} cy={C + 8} r="150" fill={`url(#${id}-bloom-b)`} />
      <circle cx={C + 26} cy={C + 8} r="150" fill={`url(#${id}-bloom-o)`} />

      <circle
        className="pn-dash"
        cx={C}
        cy={C}
        r="100"
        fill="none"
        stroke={BLUE}
        strokeOpacity="0.45"
        strokeDasharray="3 9"
      />
      <circle cx={C} cy={C} r="84" fill="none" stroke={BLUE} strokeOpacity="0.28" />

      <circle
        cx={C}
        cy={C}
        r="64"
        fill={PANEL}
        stroke={BLUE}
        strokeOpacity="0.7"
        strokeWidth="1.5"
        filter={`url(#${id}-glow)`}
      />

      {profile.avatarSrc ? (
        <image
          href={profile.avatarSrc}
          x={C - 58}
          y={C - 58}
          width="116"
          height="116"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${id}-avatar)`}
        />
      ) : (
        <g>
          <circle cx={C} cy={C} r="46" fill="none" stroke={BLUE} strokeOpacity="0.4" />
          <circle
            cx={C}
            cy={C}
            r="32"
            fill="none"
            stroke={BLUE}
            strokeOpacity="0.5"
            strokeDasharray="3 5"
          />
          <circle
            className="pn-core"
            cx={C}
            cy={C}
            r="15"
            fill={BLUE}
            filter={`url(#${id}-glow)`}
          />
        </g>
      )}

      {(name || profile.role) && (
        <g>
          <rect
            x={C - 58}
            y={C + 112}
            width="116"
            height="40"
            rx="20"
            fill={PANEL}
            fillOpacity="0.92"
            stroke="#fff"
            strokeOpacity="0.14"
          />
          <text
            x={C}
            y={C + 129}
            textAnchor="middle"
            fill="#fff"
            fontSize="13"
            fontWeight="600"
          >
            {name}
          </text>
          <text
            x={C}
            y={C + 143}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            letterSpacing="1.4"
            className="font-mono"
          >
            {(profile.role || "").toUpperCase()}
          </text>
        </g>
      )}
    </g>
  );
}

/* -------------------------------------------------------
   SECTION
------------------------------------------------------- */

export default function ProofNetwork({
  profile = DEFAULT_PROFILE,
  nodes = DEFAULT_NODES,
  heading = "One profile. Every proof.",
  subheading = "Code, platforms and skills, all connected to a single verified profile.",
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const id = `pn${uid}`;
  const [active, setActive] = useState(null);

  const placed = placeNodes(nodes);
  const links = meshLinks(placed);
  const hasActive = active !== null;
  const hubProfile = { ...DEFAULT_PROFILE, ...profile };

  return (
    <section
      aria-label="Connected profile network"
      className="relative overflow-hidden bg-transparent px-6 py-24 text-white"
    >
      <NetworkStyles />

      {/* soft glow behind the graph */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 42% 55%, rgba(2,151,222,0.14), transparent 70%), radial-gradient(ellipse 45% 40% at 62% 55%, rgba(252,115,77,0.10), transparent 70%)",
        }}
      />

      {heading && (
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-4xl leading-[0.95] tracking-tighter sm:text-5xl md:text-6xl">
            {heading}
          </h2>

          {subheading && (
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
              {subheading}
            </p>
          )}
        </div>
      )}

      <div className="relative z-10 mx-auto mt-12 aspect-square w-full max-w-[760px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full overflow-visible"
          role="group"
          aria-label="Profile connected to coding platforms and skills"
        >
          <defs>
            <filter id={`${id}-glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id={`${id}-bloom-b`}>
              <stop offset="0" stopColor={BLUE} stopOpacity="0.5" />
              <stop offset="0.55" stopColor={BLUE} stopOpacity="0.12" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${id}-bloom-o`}>
              <stop offset="0" stopColor={ORANGE} stopOpacity="0.32" />
              <stop offset="0.55" stopColor={ORANGE} stopOpacity="0.08" />
              <stop offset="1" stopColor={ORANGE} stopOpacity="0" />
            </radialGradient>

            <clipPath id={`${id}-avatar`}>
              <circle cx={C} cy={C} r="58" />
            </clipPath>
          </defs>

          {/* STARFIELD */}
          <g aria-hidden="true">
            {STARS.map((s, i) => (
              <circle
                key={i}
                className="pn-star"
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#cfe6ff"
                style={{ animationDelay: `${s.d}s` }}
              />
            ))}
          </g>

          {/* ORBITS + SATELLITES */}
          <g aria-hidden="true">
            <circle
              className="pn-dash"
              cx={C}
              cy={C}
              r={RING.inner.radius}
              fill="none"
              stroke={BLUE}
              strokeOpacity="0.22"
              strokeDasharray="2 10"
            />
            <circle
              className="pn-dash"
              cx={C}
              cy={C}
              r={RING.outer.radius}
              fill="none"
              stroke={ORANGE}
              strokeOpacity="0.2"
              strokeDasharray="2 12"
            />

            <g className="pn-sat-a">
              <circle cx={C + RING.inner.radius} cy={C} r="10" fill={BLUE} opacity="0.22" />
              <circle cx={C + RING.inner.radius} cy={C} r="3.5" fill={BLUE} />
            </g>
            <g className="pn-sat-b">
              <circle cx={C - RING.outer.radius} cy={C} r="10" fill={ORANGE} opacity="0.22" />
              <circle cx={C - RING.outer.radius} cy={C} r="3.5" fill={ORANGE} />
            </g>
          </g>

          {/* MESH between orbits */}
          <g aria-hidden="true">
            {links.map(({ a, b }) => {
              const lit = active === a.id || active === b.id;
              return (
                <line
                  key={`${a.id}-${b.id}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={lit ? a.color : "#fff"}
                  strokeOpacity={lit ? 0.5 : hasActive ? 0.04 : 0.12}
                  strokeWidth={lit ? 1.6 : 1}
                />
              );
            })}
          </g>

          {/* SPOKES from the hub */}
          <g aria-hidden="true">
            {placed.map((n) => {
              const on = active === n.id;
              const base = n.ring === "inner" ? 0.5 : 0.38;
              return (
                <line
                  key={n.id}
                  x1={C}
                  y1={C}
                  x2={n.x}
                  y2={n.y}
                  stroke={RING[n.ring].accent}
                  strokeOpacity={on ? 1 : hasActive ? 0.14 : base}
                  strokeWidth={on ? 2.2 : 1.2}
                  style={{ transition: "stroke-opacity .3s, stroke-width .3s" }}
                />
              );
            })}
          </g>

          {/* DATA PACKETS travelling hub -> node */}
          <g aria-hidden="true">
            {placed.map((n, i) => {
              const dur = 3.4 + ((i * 0.37) % 1.6);
              const begin = (i * 0.61) % 3;
              return (
                <g key={n.id} className="pn-packet" opacity="0">
                  <circle r="8" fill={RING[n.ring].accent} opacity="0.25" />
                  <circle r="2.8" fill={RING[n.ring].accent} />
                  <animateMotion
                    dur={`${dur}s`}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                    path={`M${C} ${C} L${n.x} ${n.y}`}
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur={`${dur}s`}
                    begin={`${begin}s`}
                    repeatCount="indefinite"
                  />
                </g>
              );
            })}
          </g>

          {/* NODES */}
          {placed.map((n) => {
            const { node: r, icon: s, accent } = RING[n.ring];
            const Icon = n.Icon;
            const Wrapper = n.href ? "a" : "g";
            const wrapperProps = n.href
              ? {
                  href: n.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label": `${n.label} (opens in a new tab)`,
                }
              : { tabIndex: 0, role: "img", "aria-label": n.label };

            return (
              <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
                <Wrapper
                  className="pn-node"
                  onMouseEnter={() => setActive(n.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(n.id)}
                  onBlur={() => setActive(null)}
                  {...wrapperProps}
                >
                  <g className="pn-node-inner">
                    <circle r={r + 12} fill={accent} opacity={active === n.id ? 0.2 : 0.07} />
                    <circle
                      className="pn-ring"
                      r={r}
                      fill={PANEL}
                      stroke={accent}
                      strokeOpacity={active === n.id ? 1 : 0.55}
                      strokeWidth="1.5"
                    />
                    <circle r={r - 5} fill="none" stroke="#fff" strokeOpacity="0.06" />

                    {Icon ? (
                      <g
                        transform={`translate(${-s / 2} ${-s / 2})`}
                        style={{ color: n.color }}
                      >
                        <Icon size={s} aria-hidden="true" focusable="false" />
                      </g>
                    ) : (
                      <text
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={n.color}
                        fontSize="20"
                        fontWeight="700"
                      >
                        {n.label.charAt(0)}
                      </text>
                    )}

                    <text
                      className="pn-label font-mono"
                      y={r + 20}
                      textAnchor="middle"
                      fill={active === n.id ? "#fff" : "#cbd5e1"}
                      fontSize="14"
                      letterSpacing="1.2"
                      stroke={MIDNIGHT}
                      strokeWidth="4"
                      strokeLinejoin="round"
                      paintOrder="stroke"
                    >
                      {n.label.toUpperCase()}
                    </text>
                  </g>
                </Wrapper>
              </g>
            );
          })}

          {/* HUB, drawn last so its label sits above the spokes */}
          <Hub id={id} profile={hubProfile} />
        </svg>
      </div>
    </section>
  );
}
