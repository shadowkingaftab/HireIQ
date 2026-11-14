import { useEffect, useMemo, useRef, useState } from "react";
import Mascot from "../Mascot";
import { LOGOS } from "./constellationLogos";

/*
 * Arms: -90, -18, 54, 126, 198 degrees; radii: 170, 265, 350px.
 * From badge outward: Python/JavaScript/TypeScript; React/Node/Tailwind;
 * MySQL/Docker/Git; LinkedIn/Codeforces/CodeChef; GitHub/LeetCode/HackerRank.
 */
const ARMS = [
  { angle: -90, nodes: ["python", "javascript", "typescript"] },
  { angle: -18, nodes: ["react", "node", "tailwind"] },
  { angle: 54, nodes: ["mysql", "docker", "git"] },
  { angle: 126, nodes: ["linkedin", "codeforces", "codechef"] },
  { angle: 198, nodes: ["github", "leetcode", "hackerrank"] },
];
const RADII = [170, 265, 350];
const NAMES = {
  python: ["Python", "https://python.org"], javascript: ["JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"], typescript: ["TypeScript", "https://typescriptlang.org"],
  react: ["React", "https://react.dev"], node: ["Node.js", "https://nodejs.org"], tailwind: ["Tailwind CSS", "https://tailwindcss.com"],
  mysql: ["MySQL", "https://mysql.com"], docker: ["Docker", "https://docker.com"], git: ["Git", "https://git-scm.com"],
  linkedin: ["LinkedIn", "https://linkedin.com"], codeforces: ["Codeforces", "https://codeforces.com"], codechef: ["CodeChef", "https://codechef.com"],
  github: ["GitHub", "https://github.com"], leetcode: ["LeetCode", "https://leetcode.com"], hackerrank: ["HackerRank", "https://hackerrank.com"],
};
const BRAND = { python: "#3776ab", javascript: "#f0db4f", typescript: "#3178c6", react: "#61dafb", node: "#83cd29", tailwind: "#38bdf8", mysql: "#6fb1dc", docker: "#28b8eb", git: "#f34f29", linkedin: "#0a66c2", codeforces: "#f44336", codechef: "#8b6f47", github: "#e6f4ff", leetcode: "#ffa116", hackerrank: "#2ec866" };
const CENTER = { x: 480, y: 350 };
const rad = (deg) => deg * Math.PI / 180;
const distance = (a, b, gapA, gapB) => {
  const dx = b.x - a.x; const dy = b.y - a.y; const d = Math.hypot(dx, dy) || 1;
  return [a.x + dx / d * gapA, a.y + dy / d * gapA, b.x - dx / d * gapB, b.y - dy / d * gapB];
};
const pointAt = (arm, radius) => ({ x: CENTER.x + Math.cos(rad(arm.angle)) * radius, y: CENTER.y + Math.sin(rad(arm.angle)) * radius });

export default function Constellation() {
  const stageRef = useRef(null);
  const [active, setActive] = useState(null);
  const [mobile, setMobile] = useState(false);
  const arms = useMemo(() => ARMS.map((arm, armIndex) => ({
    ...arm,
    points: arm.nodes.map((id, index) => ({ id, name: NAMES[id][0], url: NAMES[id][1], brand: BRAND[id], ...pointAt(arm, RADII[index]) })),
    armIndex,
  })), []);
  const nodes = arms.flatMap((arm) => arm.points.map((node, index) => ({ ...node, armIndex: arm.armIndex, index })));

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Animate SVG transforms directly; no React renders are scheduled per frame.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true; let raf = 0; let last = 0;
    const nodeEls = new Map([...stage.querySelectorAll("[data-node]")].map((el) => [el.dataset.node, el]));
    const lineEls = [...stage.querySelectorAll("[data-segment]")];
    const draw = (stamp) => {
      if (stamp - last < 32) { raf = requestAnimationFrame(draw); return; }
      last = stamp;
      const t = stamp / 1000;
      const positions = new Map();
      nodes.forEach((node) => {
        const amp = reduced.matches ? 0 : (mobile ? 1.5 : 3);
        const x = node.x + Math.sin(t * (2 * Math.PI / (5 + node.index * 0.65)) + node.armIndex * 1.7) * amp;
        const y = node.y + Math.cos(t * (2 * Math.PI / (6 + node.index * 0.55)) + node.armIndex * 1.4) * amp;
        positions.set(node.id, { x, y });
        nodeEls.get(node.id)?.setAttribute("transform", `translate(${x} ${y})`);
      });
      lineEls.forEach((line) => {
        const [from, to] = line.dataset.segment.split(":");
        const a = from === "badge" ? CENTER : positions.get(from);
        const b = positions.get(to);
        if (!a || !b) return;
        const gapA = from === "badge" ? (mobile ? 90 : 125) : (mobile ? 18 : 28);
        const gapB = mobile ? 18 : 28;
        const [x1, y1, x2, y2] = distance(a, b, gapA, gapB);
        line.setAttribute("x1", x1); line.setAttribute("y1", y1); line.setAttribute("x2", x2); line.setAttribute("y2", y2);
      });
      raf = reduced.matches ? 0 : requestAnimationFrame(draw);
    };
    const start = () => { stage.classList.remove("orio-paused"); if (!raf && visible && !document.hidden && !reduced.matches) raf = requestAnimationFrame(draw); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !document.hidden) start(); else { stage.classList.add("orio-paused"); stop(); } }, { threshold: 0.01 });
    const visibility = () => { if (document.hidden) { stage.classList.add("orio-paused"); stop(); } else if (visible) start(); };
    const motionChange = () => { stage.classList.toggle("orio-still", reduced.matches); if (reduced.matches) { stop(); draw(performance.now()); } else start(); };
    intersection.observe(stage); document.addEventListener("visibilitychange", visibility); reduced.addEventListener("change", motionChange);
    stage.classList.toggle("orio-still", reduced.matches);
    if (reduced.matches) draw(performance.now()); else start();
    return () => { stop(); intersection.disconnect(); document.removeEventListener("visibilitychange", visibility); reduced.removeEventListener("change", motionChange); };
  }, [nodes, mobile]);

  const segments = [];
  arms.forEach((arm) => {
    segments.push({ from: "badge", to: arm.points[0].id, armIndex: arm.armIndex, order: 0 });
    arm.points.slice(0, -1).forEach((node, index) => segments.push({ from: node.id, to: arm.points[index + 1].id, armIndex: arm.armIndex, order: index + 1 }));
  });
  arms.forEach((arm, i) => segments.push({ from: arm.points[2].id, to: arms[(i + 1) % arms.length].points[2].id, armIndex: i, order: 3, outline: true }));
  const scaledCenter = mobile ? { x: 310, y: 225 } : CENTER;
  const scale = mobile ? 0.66 : 1;
  const viewBox = mobile ? "0 0 620 450" : "0 0 960 700";
  const convert = (p) => mobile ? { x: scaledCenter.x + (p.x - CENTER.x) * scale, y: scaledCenter.y + (p.y - CENTER.y) * scale } : p;
  const strokeWidth = mobile ? 3.7 : 2.5;
  const selectedArm = active ? nodes.find((n) => n.id === active)?.armIndex : null;

  return (
    <section ref={stageRef} className="orio-constellation relative z-[1] mx-auto mt-5 w-full max-w-[960px]" aria-label="ORIO verified profile constellation">
      <style>{`
        @keyframes orio-float { 0%,100%{transform:translateY(-4px)}50%{transform:translateY(4px)} }
        @keyframes orio-shimmer { 0%,72%,100%{transform:translateX(-180%) rotate(24deg);opacity:0}78%{opacity:.55}90%{transform:translateX(180%) rotate(24deg);opacity:0} }
        @keyframes orio-energy { from{offset-distance:0%}to{offset-distance:100%} }
        @keyframes orio-outline { 0%,100%{filter:brightness(1)}50%{filter:brightness(1.8)} }
        .orio-constellation{height:clamp(450px,72.92vw,700px);overflow:visible;isolation:isolate}
        .orio-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
        .orio-line{stroke:url(#orio-gradient);stroke-width:${strokeWidth}px;stroke-linecap:round;filter:url(#orio-glow);opacity:.96;transition:opacity .2s}
        .orio-node{cursor:pointer;outline:none;transition:opacity .2s}
        .orio-node circle{fill:rgba(6,17,27,.92);stroke:var(--brand);stroke-width:2;filter:drop-shadow(0 0 7px var(--brand));transition:filter .2s,stroke-width .2s}
        .orio-node:focus-visible circle,.orio-node:hover circle{stroke:#fff;stroke-width:3;filter:drop-shadow(0 0 13px var(--brand))}
        .orio-label{opacity:.92;transition:opacity .18s}
        .orio-energy{fill:#e8faff;filter:drop-shadow(0 0 6px #7fd8ff);offset-rotate:auto;animation:orio-energy 3.2s linear infinite}
        .orio-energy-halo{fill:#7fd8ff;opacity:.38;filter:blur(2px);offset-rotate:auto;animation:orio-energy 3.2s linear infinite}
        .orio-energy-trail{fill:none;stroke:#c3f0ff;stroke-width:2.2;stroke-linecap:round;opacity:.5;filter:url(#orio-glow)}
        .orio-line.orio-outline-pulse{animation:orio-outline 8s ease-in-out infinite;animation-delay:var(--pulse-delay);}
        .orio-orb{position:absolute;left:50%;top:50%;width:250px;height:250px;transform:translate(-50%,-50%);display:grid;place-items:center;overflow:hidden;border-radius:50%;border:1px solid rgba(227,247,255,.76);background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.32),rgba(137,203,241,.13) 42%,rgba(4,30,61,.35) 78%,rgba(255,138,76,.15));backdrop-filter:blur(22px) saturate(1.55);-webkit-backdrop-filter:blur(22px) saturate(1.55);box-shadow:0 0 32px rgba(2,151,222,.32),0 8px 34px rgba(252,115,77,.14),inset 0 1px 2px rgba(255,255,255,.9),inset 0 -2px 8px rgba(255,255,255,.3)}
        .orio-orb:before{content:"";position:absolute;inset:5px auto 8px 5px;width:35%;border-radius:50%;border-left:2px solid rgba(255,255,255,.78);border-top:1px solid rgba(255,255,255,.65);filter:blur(1px);transform:rotate(-18deg);pointer-events:none}
        .orio-orb:after{content:"";position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.18),transparent 18%,transparent 85%,rgba(2,151,222,.12));pointer-events:none}
        .orio-orb .orio-shimmer{position:absolute;z-index:2;inset:-25% auto -25% 0;width:30%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.34),transparent);filter:blur(8px);animation:orio-shimmer 8s ease-in-out infinite}
        .orio-mascot{width:58%;height:auto;animation:orio-float 6s ease-in-out infinite;filter:drop-shadow(0 9px 9px rgba(0,0,0,.35)) drop-shadow(0 0 10px rgba(2,151,222,.38))}
        .orio-tag{position:absolute;z-index:2;left:50%;top:calc(50% + 132px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap;border:1px solid rgba(213,235,255,.3);border-radius:999px;background:rgba(3,10,24,.88);padding:7px 15px;color:#f4faff;font:700 12px/1 ui-monospace,monospace;letter-spacing:.16em;box-shadow:0 5px 16px rgba(0,0,0,.28)}
        .orio-tag small{color:#b7cada;font-size:8px;letter-spacing:.17em}
        .orio-constellation.orio-still .orio-energy,.orio-constellation.orio-still .orio-outline-pulse,.orio-constellation.orio-still .orio-shimmer,.orio-constellation.orio-still .orio-mascot{animation:none}
        .orio-constellation.orio-paused .orio-energy,.orio-constellation.orio-paused .orio-energy-halo,.orio-constellation.orio-paused .orio-outline-pulse,.orio-constellation.orio-paused .orio-shimmer,.orio-constellation.orio-paused .orio-mascot{animation-play-state:paused}
        @media(max-width:767px){.orio-constellation{height:auto;aspect-ratio:620/450;margin-top:1rem}.orio-orb{width:180px;height:180px}.orio-tag{top:calc(50% + 96px);padding:6px 12px}.orio-mascot{width:58%}.orio-node .orio-label{opacity:0}.orio-node:hover .orio-label,.orio-node:focus .orio-label,.orio-node:focus-visible .orio-label{opacity:1}}
        @media(prefers-reduced-motion:reduce){.orio-energy,.orio-outline-pulse,.orio-shimmer,.orio-mascot{animation:none!important}.orio-node,.orio-line,.orio-label{transition:none!important}}
      `}</style>
      <svg className="orio-svg" viewBox={viewBox} role="group" aria-label="Verified platforms and skills connected to the ORIO profile">
        <defs>
          <linearGradient id="orio-gradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7FD8FF"/><stop offset="100%" stopColor="#FF8A4C"/></linearGradient>
          <filter id="orio-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g transform={mobile ? `translate(${scaledCenter.x} ${scaledCenter.y}) scale(${scale}) translate(${-CENTER.x} ${-CENTER.y})` : undefined}>
          {segments.map((segment) => {
            const a = segment.from === "badge" ? CENTER : nodes.find((node) => node.id === segment.from);
            const b = nodes.find((node) => node.id === segment.to);
            const [x1,y1,x2,y2] = distance(a,b,segment.from === "badge" ? 125 : 28,28);
            const isLit = selectedArm === segment.armIndex && (segment.order === 0 || (active && (nodes.find((n)=>n.id===active)?.index ?? 3) >= segment.order));
            return <line key={`${segment.from}-${segment.to}`} className={`orio-line${segment.outline ? " orio-outline-pulse" : ""}`} data-segment={`${segment.from}:${segment.to}`} x1={x1} y1={y1} x2={x2} y2={y2} style={{ opacity: active ? (isLit ? 1 : .2) : .96, "--pulse-delay": `${segment.armIndex * 1.6}s` }} />;
          })}
          {arms.map((arm, i) => {
            const start = distance(CENTER, arm.points[0], 125, 28);
            const pathPoints = [{ x: start[0], y: start[1] }, ...arm.points];
            const path = pathPoints.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");
            return <g key={`energy-${i}`} style={{ opacity: active && selectedArm !== i ? .2 : 1 }}>
              <path id={`orio-arm-${i}`} d={path} className="orio-energy-trail" />
              <circle r="4.5" className="orio-energy-halo" style={{ offsetPath: `path('${path}')`, animationDelay: `${i * .6 + .06}s`, animationDuration: "3.2s" }} />
              <circle r="2" className="orio-energy" style={{ offsetPath: `path('${path}')`, animationDelay: `${i * .6}s`, animationDuration: "3.2s" }}><title>Energy flow</title></circle>
            </g>;
          })}
          {nodes.map((node) => {
            const thisActive = active === node.id;
            const onPath = selectedArm === node.armIndex && active && node.index <= (nodes.find((n)=>n.id===active)?.index ?? -1);
            const size = mobile ? 18 : 28;
            return <a key={node.id} href={node.url} target="_blank" rel="noopener noreferrer" aria-label={node.name} className="orio-node" data-node={node.id} transform={`translate(${node.x} ${node.y})`} style={{ "--brand": node.brand, opacity: active ? (thisActive || onPath ? 1 : .2) : 1 }} onMouseEnter={() => setActive(node.id)} onMouseLeave={() => setActive(null)} onFocus={() => setActive(node.id)} onBlur={() => setActive(null)}>
              <circle r={size} />
              <image href={LOGOS[node.id]} x={-15} y={-15} width="30" height="30" preserveAspectRatio="xMidYMid meet" />
              <g className="orio-label" transform={`translate(0 ${size + 10})`}>
                <rect x={-Math.max(42,node.name.length*4.2+13)} y="0" width={Math.max(84,node.name.length*8.4+26)} height="23" rx="11.5" fill="rgba(2,7,10,.86)" stroke="rgba(176,224,250,.24)" />
                <text y="15.5" textAnchor="middle" fill="#E6F4FF" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="1.5" fontWeight="700">{node.name.toUpperCase()}</text>
              </g>
            </a>;
          })}
        </g>
      </svg>
      <div className="orio-orb" aria-hidden="true"><span className="orio-shimmer"/><Mascot className="orio-mascot" title="" /></div>
      <div className="orio-tag" aria-hidden="true">ORIO<small>VERIFIED PROFILE</small></div>
    </section>
  );
}
