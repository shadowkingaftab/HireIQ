import { useEffect, useMemo, useRef, useState } from "react";
import Mascot from "../Mascot";
import { LOGOS } from "./constellationLogos";

/*
 * Seeded star-chart layout: the same node list and viewport produce the same
 * irregular arrangement on every load. Edit DEFAULT_NODES to change platforms
 * and skills; the layout, paths, and mobile subset are derived from that list.
 */
const DEFAULT_NODES = [
  { id: "github", label: "GitHub", side: "cool", url: "https://github.com" },
  { id: "linkedin", label: "LinkedIn", side: "cool", url: "https://linkedin.com" },
  { id: "leetcode", label: "LeetCode", side: "cool", url: "https://leetcode.com" },
  { id: "codechef", label: "CodeChef", side: "cool", url: "https://codechef.com" },
  { id: "hackerrank", label: "HackerRank", side: "cool", url: "https://hackerrank.com" },
  { id: "codeforces", label: "Codeforces", side: "cool", url: "https://codeforces.com" },
  { id: "python", label: "Python", side: "warm", url: "https://python.org" },
  { id: "javascript", label: "JavaScript", side: "warm", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { id: "react", label: "React", side: "warm", url: "https://react.dev" },
  { id: "node", label: "Node.js", side: "warm", url: "https://nodejs.org" },
  { id: "mysql", label: "MySQL", side: "warm", url: "https://mysql.com" },
  { id: "docker", label: "Docker", side: "warm", url: "https://docker.com" },
  { id: "git", label: "Git", side: "warm", url: "https://git-scm.com" },
  { id: "typescript", label: "TypeScript", side: "warm", url: "https://typescriptlang.org" },
  { id: "tailwind", label: "Tailwind", side: "warm", url: "https://tailwindcss.com" },
];
const MOBILE_IDS = new Set(["github", "linkedin", "leetcode", "python", "javascript", "react", "node", "mysql", "tailwind"]);
const PLATFORM_IDS = new Set(["github", "linkedin", "leetcode", "codechef", "hackerrank", "codeforces"]);
const GOLDEN_SEED = 0x0a71e7;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

function seeded(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function makeLayout(nodes, width, height, mobile, badgeSize) {
  const random = seeded(GOLDEN_SEED + width * 13 + height * 7 + nodes.length);
  const badgeRadius = badgeSize / 2;
  const centerY = clamp(height * 0.68 + badgeRadius + 10, badgeRadius + 10, height - badgeRadius - 42);
  const center = { id: "__center__", x: width / 2, y: centerY, radius: badgeRadius };
  const nodeRadius = mobile ? 18 : 22;
  const minGap = 90;
  const maxRadius = Math.max(mobile ? 122 : 205, Math.min(mobile ? 240 : 470, width / 2 - nodeRadius - 18));
  const placed = [];

  nodes.forEach((item, index) => {
    const inner = index < Math.ceil(nodes.length * 0.44);
    const low = mobile ? (inner ? 130 : 170) : (inner ? 200 : 320);
    const high = Math.min(maxRadius, mobile ? (inner ? 175 : 240) : (inner ? 260 : 470));
    let point = null;
    for (let tries = 0; tries < 420 && !point; tries += 1) {
      const radius = low + random() * Math.max(1, high - low);
      const angle = random() * Math.PI * 2;
      const sideBias = (item.side === "cool" || PLATFORM_IDS.has(item.id) ? -1 : 1) * width * 0.055;
      const x = center.x + Math.cos(angle) * radius + sideBias;
      const y = center.y + Math.sin(angle) * radius * (mobile ? 0.72 : 0.82);
      if (x < nodeRadius + 12 || x > width - nodeRadius - 12 || y < nodeRadius + 12 || y > height - nodeRadius - 12) continue;
      if (placed.some((other) => Math.hypot(x - other.x, y - other.y) < minGap)) continue;
      point = { ...item, x, y, radius: nodeRadius, phase: random() * Math.PI * 2, speed: 0.13 + random() * 0.1, amp: mobile ? 1.2 : 2.2 };
    }
    if (!point) {
      const angle = random() * Math.PI * 2;
      const radius = Math.min(maxRadius, low);
      point = { ...item, x: clamp(center.x + Math.cos(angle) * radius, 30, width - 30), y: clamp(center.y + Math.sin(angle) * radius * 0.72, 30, height - 30), radius: nodeRadius, phase: random() * 7, speed: 0.16, amp: 0 };
    }
    placed.push(point);
  });

  // Four nearby badges link to the profile; the remaining chart is a sparse tree
  // with a few local loops. Every badge has a route to the centre, with <26 edges.
  const edges = [];
  const degree = new Map(placed.map((n) => [n.id, 0]));
  const addEdge = (a, b) => {
    if (!a || !b || edges.some((edge) => (edge.a === a.id && edge.b === b.id) || (edge.a === b.id && edge.b === a.id))) return false;
    edges.push({ id: `edge-${edges.length}`, a: a.id, b: b.id, bend: (random() - 0.5) * 0.28 });
    if (a.id !== center.id) degree.set(a.id, degree.get(a.id) + 1);
    if (b.id !== center.id) degree.set(b.id, degree.get(b.id) + 1);
    return true;
  };
  const byDistance = [...placed].sort((a, b) => Math.hypot(a.x - center.x, a.y - center.y) - Math.hypot(b.x - center.x, b.y - center.y));
  byDistance.slice(0, Math.min(4, placed.length)).forEach((node) => addEdge(center, node));
  placed.forEach((node) => {
    if (degree.get(node.id)) return;
    const candidates = placed.filter((other) => other !== node && degree.get(other.id) < 2 && !edges.some((e) => (e.a === node.id && e.b === other.id) || (e.b === node.id && e.a === other.id)));
    candidates.sort((a, b) => Math.hypot(a.x - node.x, a.y - node.y) - Math.hypot(b.x - node.x, b.y - node.y));
    if (candidates[0]) addEdge(node, candidates[0]);
  });
  for (let i = 0; i < placed.length && edges.length < 24; i += 1) {
    for (let j = i + 1; j < placed.length && edges.length < 24; j += 1) {
      if (degree.get(placed[i].id) >= 2 || degree.get(placed[j].id) >= 2) continue;
      const distance = Math.hypot(placed[i].x - placed[j].x, placed[i].y - placed[j].y);
      if (distance < maxRadius * 0.78 && random() > 0.64) addEdge(placed[i], placed[j]);
    }
  }

  const points = [center, ...placed];
  const pointById = Object.fromEntries(points.map((p) => [p.id, p]));
  const adjacency = new Map(points.map((p) => [p.id, []]));
  edges.forEach((edge, index) => {
    edge.index = index;
    adjacency.get(edge.a).push([edge.b, index]);
    adjacency.get(edge.b).push([edge.a, index]);
  });
  const paths = {};
  placed.forEach((node) => {
    const queue = ["__center__"];
    const previous = new Map([["__center__", null]]);
    while (queue.length && !previous.has(node.id)) {
      const current = queue.shift();
      adjacency.get(current).forEach(([next, edgeIndex]) => {
        if (!previous.has(next)) { previous.set(next, [current, edgeIndex]); queue.push(next); }
      });
    }
    let cursor = node.id;
    const route = [];
    while (cursor !== "__center__" && previous.has(cursor)) {
      const [parent, edgeIndex] = previous.get(cursor);
      route.push({ from: cursor, to: parent, edgeIndex });
      cursor = parent;
    }
    paths[node.id] = route;
  });
  return { center, nodes: placed, points: pointById, edges, paths, stars: Array.from({ length: mobile ? 18 : 30 }, () => ({ x: random() * width, y: random() * height, r: 0.7 + random() * 1.5, delay: `${random() * 7}s`, duration: `${3 + random() * 4}s` })) };
}

function curve(edge, points, positions, centerRadius) {
  const a = points[edge.a];
  const b = points[edge.b];
  const pa = positions.get(edge.a) || a;
  const pb = positions.get(edge.b) || b;
  const dx = pb.x - pa.x;
  const dy = pb.y - pa.y;
  const distance = Math.hypot(dx, dy) || 1;
  const startGap = edge.a === "__center__" ? centerRadius + 10 : a.radius + 7;
  const endGap = edge.b === "__center__" ? centerRadius + 10 : b.radius + 7;
  const ux = dx / distance;
  const uy = dy / distance;
  const x1 = pa.x + ux * startGap;
  const y1 = pa.y + uy * startGap;
  const x2 = pb.x - ux * endGap;
  const y2 = pb.y - uy * endGap;
  const bend = edge.bend * Math.min(distance, 180);
  const cx = (x1 + x2) / 2 - (dy / distance) * bend;
  const cy = (y1 + y2) / 2 + (dx / distance) * bend;
  return { d: `M${x1},${y1} Q${cx},${cy} ${x2},${y2}`, curve: [x1, y1, cx, cy, x2, y2] };
}

const pointOnCurve = ([x1, y1, cx, cy, x2, y2], t) => ({
  x: (1 - t) ** 2 * x1 + 2 * (1 - t) * t * cx + t ** 2 * x2,
  y: (1 - t) ** 2 * y1 + 2 * (1 - t) * t * cy + t ** 2 * y2,
});

export default function Constellation({ size = 300, nodes = DEFAULT_NODES, title = "ORIO" }) {
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const nodeRefs = useRef(new Map());
  const edgeRefs = useRef(new Map());
  const pulseRefs = useRef([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0, mobile: false });
  const [active, setActive] = useState(null);
  const chartNodes = useMemo(() => viewport.mobile ? (nodes === DEFAULT_NODES ? nodes.filter((node) => MOBILE_IDS.has(node.id)).slice(0, 9) : nodes.slice(0, 9)) : nodes.slice(0, 16), [nodes, viewport.mobile]);
  const badgeSize = viewport.width ? Math.min(size, viewport.mobile ? viewport.width * 0.48 : size, Math.max(150, viewport.height * 0.32 - 56)) : size;
  const layout = useMemo(() => makeLayout(chartNodes, viewport.width || 1440, viewport.height || 900, viewport.mobile, badgeSize), [chartNodes, viewport.width, viewport.height, viewport.mobile, badgeSize]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const measure = () => setViewport({ width: Math.round(stage.clientWidth), height: Math.round(stage.clientHeight), mobile: window.matchMedia("(max-width: 767px)").matches });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    const media = window.matchMedia("(max-width: 767px)");
    media.addEventListener("change", measure);
    return () => { observer.disconnect(); media.removeEventListener("change", measure); };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = svgRef.current;
    if (!stage || !svg || !viewport.width || !viewport.height) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const positions = new Map(layout.nodes.map((node) => [node.id, { x: node.x, y: node.y }]));
    positions.set("__center__", layout.center);
    const rng = seeded(GOLDEN_SEED + 17);
    const pulses = Array.from({ length: 3 }, (_, i) => ({ on: false, route: [], started: 0, duration: 5, next: 1 + i * 1.8 }));
    let raf = 0;
    let lastFrame = 0;
    let visible = true;

    const update = (time) => {
      if (time - lastFrame < 32) { raf = requestAnimationFrame(update); return; }
      lastFrame = time;
      const seconds = time / 1000;
      const still = reduced.matches;
      layout.nodes.forEach((node) => {
        const point = still ? node : { x: node.x + Math.sin(seconds * node.speed + node.phase) * node.amp, y: node.y + Math.cos(seconds * node.speed * 0.83 + node.phase) * node.amp * 0.82 };
        positions.set(node.id, point);
        nodeRefs.current.get(node.id)?.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
      });
      layout.edges.forEach((edge) => {
        const path = edgeRefs.current.get(edge.id);
        if (path) path.setAttribute("d", curve(edge, layout.points, positions, badgeSize / 2).d);
      });
      if (!still) {
        pulses.forEach((pulse, index) => {
          if (!pulse.on && seconds >= pulse.next && layout.nodes.length) {
            const source = layout.nodes[Math.floor(rng() * layout.nodes.length)];
            pulse.route = layout.paths[source.id] || [];
            pulse.started = seconds;
            pulse.duration = Math.max(2.8, pulse.route.length * 1.15);
            pulse.on = pulse.route.length > 0;
            pulse.next = seconds + 4 + rng() * 4 + index * 0.7;
          }
          const el = pulseRefs.current[index];
          if (!el) return;
          if (!pulse.on) { el.setAttribute("opacity", "0"); return; }
          const progress = (seconds - pulse.started) / pulse.duration;
          if (progress >= 1) { pulse.on = false; el.setAttribute("opacity", "0"); return; }
          const segment = Math.min(pulse.route.length - 1, Math.floor(progress * pulse.route.length));
          const local = progress * pulse.route.length - segment;
          const edgeInfo = pulse.route[segment];
          const geometry = curve(layout.edges[edgeInfo.edgeIndex], layout.points, positions, badgeSize / 2);
          const forward = layout.edges[edgeInfo.edgeIndex].a === edgeInfo.from;
          const point = pointOnCurve(geometry.curve, forward ? local : 1 - local);
          el.setAttribute("transform", `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)})`);
          el.setAttribute("opacity", String(Math.sin(Math.PI * progress) * 0.9));
        });
      }
      raf = still ? 0 : requestAnimationFrame(update);
    };
    const start = () => { if (!raf && visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(update); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const setPaused = (paused) => { stage.classList.toggle("cs-paused", paused); if (paused) stop(); else start(); };
    const onMotion = () => { stage.classList.toggle("cs-still", reduced.matches); if (reduced.matches) { stop(); update(performance.now()); } else start(); };
    const onVisibility = () => setPaused(document.hidden || !visible);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; onVisibility(); }, { threshold: 0.01 });
    intersection.observe(stage);
    reduced.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    stage.classList.toggle("cs-still", reduced.matches);
    if (reduced.matches) update(performance.now()); else start();
    return () => { stop(); intersection.disconnect(); reduced.removeEventListener("change", onMotion); document.removeEventListener("visibilitychange", onVisibility); };
  }, [layout, badgeSize, viewport.width, viewport.height]);

  const activeEdges = active ? new Set(layout.paths[active]?.map((part) => part.edgeIndex) || []) : null;
  const activeNodes = active ? new Set([active, ...(layout.paths[active] || []).map((part) => part.to)]) : null;

  return (
    <div ref={stageRef} className="constellation-stage pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <style>{`
        @keyframes cs-twinkle { 0%,100% { opacity:.18; transform:scale(.8) } 50% { opacity:.85; transform:scale(1.25) } }
        @keyframes cs-float { 0%,100% { transform:translateY(-4px) } 50% { transform:translateY(4px) } }
        @keyframes cs-shimmer { 0%,72%,100% { transform:translateX(-180%) rotate(24deg); opacity:0 } 78% { opacity:.55 } 90% { transform:translateX(180%) rotate(24deg); opacity:0 } }
        .constellation-stage .cs-star { animation:cs-twinkle var(--duration) ease-in-out var(--delay) infinite }
        .constellation-stage .cs-float { animation:cs-float 6s ease-in-out infinite }
        .constellation-stage .cs-shimmer { animation:cs-shimmer 8s ease-in-out infinite }
        .constellation-stage .cs-edge,.constellation-stage .cs-star { pointer-events:none }
        .constellation-stage .cs-edge { transition:opacity .2s,stroke .2s }
        .constellation-stage .cs-node { pointer-events:all; cursor:pointer; outline:none; transition:opacity .2s }
        .constellation-stage .cs-node:focus-visible circle:first-child { stroke:#fff; stroke-width:2.4 }
        .constellation-stage .cs-node:hover circle:first-child { stroke-opacity:.9 }
        .constellation-stage .cs-node-label { opacity:.62; transition:opacity .2s }
        .constellation-stage .cs-orb { position:relative; display:flex; align-items:center; justify-content:center; width:100%; height:100%; overflow:hidden; border:1px solid rgba(229,246,255,.5); border-radius:50%; background:radial-gradient(ellipse at 32% 20%,rgba(247,253,255,.32),rgba(164,218,246,.12) 38%,rgba(30,70,105,.2) 76%,rgba(253,115,77,.12)); -webkit-backdrop-filter:blur(24px) saturate(1.6); backdrop-filter:blur(24px) saturate(1.6); box-shadow:0 0 56px rgba(2,151,222,.28),0 18px 46px rgba(252,115,77,.12),inset 0 1px 2px rgba(255,255,255,.76),inset 0 -2px 8px rgba(255,255,255,.22) }
        .constellation-stage .cs-orb::before { content:""; position:absolute; inset:3px 8px auto 5px; height:43%; border-radius:100% 45% 60% 38%; background:radial-gradient(ellipse at 28% 0%,rgba(255,255,255,.52),rgba(218,243,255,.15) 48%,transparent 78%); filter:blur(4px); transform:rotate(-16deg); pointer-events:none }
        .constellation-stage .cs-orb::after { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(180deg,rgba(255,255,255,.34),transparent 15%,transparent 82%,rgba(255,255,255,.22)); opacity:.75; pointer-events:none }
        .constellation-stage .cs-shimmer { position:absolute; z-index:2; top:-30%; bottom:-30%; left:0; width:32%; background:linear-gradient(90deg,transparent,rgba(255,255,255,.23),transparent); filter:blur(8px); pointer-events:none }
        .constellation-stage .cs-mascot { position:relative; z-index:1; width:58%; height:auto; filter:drop-shadow(0 10px 12px rgba(0,0,0,.42)) drop-shadow(0 0 14px rgba(2,151,222,.3)) }
        .constellation-stage .cs-orb-label { display:flex; min-width:116px; flex-direction:column; align-items:center; gap:2px; padding:7px 13px 6px; border:1px solid rgba(185,218,243,.15); border-radius:999px; color:#f2f7ff; background:rgba(3,10,24,.76); box-shadow:0 8px 25px rgba(0,0,0,.22); font:700 12px/1.1 ui-monospace,SFMono-Regular,Menlo,monospace; letter-spacing:.14em; text-align:center }
        .constellation-stage .cs-orb-label small { color:#aab9cb; font-size:8px; letter-spacing:.14em }
        .constellation-stage.cs-paused .cs-star,.constellation-stage.cs-paused .cs-float,.constellation-stage.cs-paused .cs-shimmer,.constellation-stage.cs-still .cs-star,.constellation-stage.cs-still .cs-float,.constellation-stage.cs-still .cs-shimmer { animation:none }
        @media(max-width:767px) { .constellation-stage .cs-node-label { opacity:0 } .constellation-stage .cs-node:focus .cs-node-label,.constellation-stage .cs-node:hover .cs-node-label { opacity:1 } }
        @media(prefers-reduced-motion:reduce) { .constellation-stage .cs-star,.constellation-stage .cs-float,.constellation-stage .cs-shimmer { animation:none } .constellation-stage .cs-edge,.constellation-stage .cs-node-label,.constellation-stage .cs-node { transition:none } }
      `}</style>
      {viewport.width > 0 && viewport.height > 0 && (
        <>
          <div className="cs-horizon-glow absolute left-1/2 top-[68%] h-[42%] w-[min(92vw,1080px)] -translate-x-1/2 rounded-[50%]" aria-hidden="true" style={{ background: "radial-gradient(ellipse at 34% 52%,rgba(2,151,222,.22),transparent 46%),radial-gradient(ellipse at 66% 52%,rgba(252,115,77,.22),transparent 48%),radial-gradient(ellipse at 50% 66%,rgba(255,183,131,.24),transparent 40%)", filter: "blur(48px)" }} />
          <svg ref={svgRef} className="absolute inset-0 h-full w-full" viewBox={`0 0 ${viewport.width} ${viewport.height}`} role="group" aria-label="A constellation of verified platforms and skills surrounding the ORIO profile">
            {layout.stars.map((star, i) => <circle key={`star-${i}`} className="cs-star" cx={star.x} cy={star.y} r={star.r} fill={i % 5 === 0 ? "#d8efff" : "#8db9dc"} style={{ "--delay": star.delay, "--duration": star.duration }} />)}
            <g fill="none" strokeLinecap="round">
              {layout.edges.map((edge) => {
                const selected = activeEdges?.has(edge.index);
                const related = selected || (activeNodes && (activeNodes.has(edge.a) || activeNodes.has(edge.b)));
                const warm = layout.points[edge.a]?.side === "warm" || layout.points[edge.b]?.side === "warm";
                return <path key={edge.id} ref={(el) => el && edgeRefs.current.set(edge.id, el)} className="cs-edge" d={curve(edge, layout.points, new Map(), badgeSize / 2).d} stroke={selected ? "#fff" : warm ? "#FFC3A7" : "#A8D7F4"} strokeWidth={selected ? 1.7 : 1} opacity={active ? (related ? .85 : .08) : .42} />;
              })}
            </g>
            {layout.nodes.map((node) => (
              <a key={node.id} ref={(el) => el && nodeRefs.current.set(node.id, el)} className="cs-node" transform={`translate(${node.x} ${node.y})`} href={node.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${node.label} in a new tab`} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(node.id)} onMouseLeave={() => setActive(null)} opacity={active ? (activeNodes?.has(node.id) ? 1 : .14) : 1}>
                <circle r={node.radius + 8} fill={node.side === "warm" ? "#FC734D" : "#0297DE"} fillOpacity=".08" stroke={node.side === "warm" ? "#FC734D" : "#0297DE"} strokeOpacity=".25" strokeWidth="1" />
                <circle r={node.radius} fill="#07111F" fillOpacity=".92" stroke={node.side === "warm" ? "#FC734D" : "#0297DE"} strokeOpacity=".45" strokeWidth="1" />
                <image href={LOGOS[node.id]} x={-13} y={-13} width="26" height="26" preserveAspectRatio="xMidYMid meet" />
                <text className="cs-node-label" y={node.radius + 19} textAnchor="middle" fill="#DCEBFA" stroke="#02070A" strokeWidth="3.5" strokeLinejoin="round" paintOrder="stroke" fontFamily="ui-monospace,SFMono-Regular,Menlo,monospace" fontSize={viewport.mobile ? 9 : 10} letterSpacing="1.1">{node.label.toUpperCase()}</text>
              </a>
            ))}
            {[0, 1, 2].map((i) => <circle key={`pulse-${i}`} ref={(el) => { pulseRefs.current[i] = el; }} r="3" fill={i === 1 ? "#FFC9AE" : "#C8EEFF"} filter="drop-shadow(0 0 5px #8fe2ff)" opacity="0" />)}
            <foreignObject x={layout.center.x - badgeSize / 2} y={layout.center.y - badgeSize / 2} width={badgeSize} height={badgeSize + 58}>
              <div xmlns="http://www.w3.org/1999/xhtml" className="flex h-full flex-col items-center" aria-hidden="true">
                <div className="cs-orb" style={{ width: badgeSize, height: badgeSize }}><Mascot className="cs-mascot cs-float" title="" /><span className="cs-shimmer" /></div>
                <div className="cs-orb-label mt-2"><span>{title}</span><small>VERIFIED PROFILE</small></div>
              </div>
            </foreignObject>
          </svg>
        </>
      )}
    </div>
  );
}
