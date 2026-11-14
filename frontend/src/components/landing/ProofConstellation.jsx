import { useEffect, useMemo, useRef, useState } from "react";
import Mascot from "../Mascot";
import { LOGOS } from "./constellationLogos";

/* Seed 1729 keeps three loose clusters stable; edit CLUSTERS/NODES to change the chart. */
const NODES = [
  ["github", "GitHub", "https://github.com", "platforms"], ["linkedin", "LinkedIn", "https://linkedin.com", "platforms"],
  ["leetcode", "LeetCode", "https://leetcode.com", "platforms"], ["codechef", "CodeChef", "https://codechef.com", "platforms"],
  ["hackerrank", "HackerRank", "https://hackerrank.com", "platforms"], ["codeforces", "Codeforces", "https://codeforces.com", "platforms"],
  ["react", "React", "https://react.dev", "skills"], ["node", "Node.js", "https://nodejs.org", "skills"],
  ["tailwind", "Tailwind CSS", "https://tailwindcss.com", "skills"], ["mysql", "MySQL", "https://mysql.com", "skills"],
  ["docker", "Docker", "https://docker.com", "skills"], ["git", "Git", "https://git-scm.com", "skills"],
  ["python", "Python", "https://python.org", "center"], ["javascript", "JavaScript", "https://developer.mozilla.org/en-US/docs/Web/JavaScript", "center"],
  ["typescript", "TypeScript", "https://typescriptlang.org", "center"],
];
const CLUSTERS = { platforms: ["github", "linkedin", "leetcode", "codechef", "hackerrank", "codeforces"], skills: ["react", "node", "tailwind", "mysql", "docker", "git"], center: ["python", "javascript", "typescript"] };
const CENTER = { x: 480, y: 310 };
const COLORS = { github: "#e6f4ff", linkedin: "#0a66c2", leetcode: "#ffa116", codechef: "#8b6f47", hackerrank: "#2ec866", codeforces: "#f44336", python: "#3776ab", javascript: "#f0db4f", react: "#61dafb", node: "#83cd29", mysql: "#6fb1dc", docker: "#28b8eb", git: "#f34f29", typescript: "#3178c6", tailwind: "#38bdf8" };
const RANGES = { platforms: [105, 345, 95, 525], skills: [615, 855, 95, 525], center: [310, 650, 28, 592] };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
function mulberry32(seed) { return () => { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function makeNodes() {
  const random = mulberry32(1729); const placed = [];
  for (const [id, name, url, cluster] of NODES) {
    const [minX, maxX, minY, maxY] = RANGES[cluster]; let point;
    for (let tries = 0; tries < 12000 && !point; tries += 1) {
      const x = minX + random() * (maxX - minX); const y = minY + random() * (maxY - minY);
      const r = Math.hypot(x - CENTER.x, y - CENTER.y); const angle = Math.atan2(y - CENTER.y, x - CENTER.x);
      if (r < 200 || r > 380 || placed.some((p) => Math.hypot(x - p.x, y - p.y) < 110 || Math.abs(Math.atan2(Math.sin(angle - p.angle), Math.cos(angle - p.angle))) < .1)) continue;
      point = { id, name, url, cluster, x, y, angle, brand: COLORS[id], phase: random() * Math.PI * 2, cycle: 6 + random() * 4 };
    }
    if (!point) { const i = placed.filter((n) => n.cluster === cluster).length; const x = clamp(minX + (i + 1) * 112, minX, maxX); const y = minY + (i + 1) * 104; point = { id, name, url, cluster, x, y, angle: Math.atan2(y-CENTER.y,x-CENTER.x), brand: COLORS[id], phase: 0, cycle: 8 }; }
    placed.push(point);
  }
  return placed;
}
function makeEdges(nodes, random) {
  const edges = [];
  for (const ids of Object.values(CLUSTERS)) {
    const remaining = ids.map((id) => nodes.find((n) => n.id === id));
    let current = remaining.splice(Math.floor(random() * remaining.length), 1)[0];
    while (remaining.length) {
      remaining.sort((a, b) => Math.hypot(a.x-current.x,a.y-current.y)-Math.hypot(b.x-current.x,b.y-current.y));
      const next = remaining.shift(); edges.push({ a: current.id, b: next.id, cluster: current.cluster }); current = next;
    }
  }
  for (const [cluster, ids] of Object.entries(CLUSTERS)) {
    const sorted = ids.map((id) => nodes.find((n) => n.id === id)).sort((a,b) => Math.hypot(a.x-CENTER.x,a.y-CENTER.y)-Math.hypot(b.x-CENTER.x,b.y-CENTER.y));
    for (const node of sorted.slice(0, 3)) edges.push({ a: node.id, b: "__center__", cluster, trunk: true });
  }
  return edges;
}
function routeFor(start, edges) {
  const queue = [start]; const previous = new Map([[start, null]]);
  while (queue.length && !previous.has("__center__")) {
    const current = queue.shift();
    edges.forEach((edge, index) => { const next = edge.a === current ? edge.b : edge.b === current ? edge.a : null; if (next && !previous.has(next)) { previous.set(next, [current, index]); queue.push(next); } });
  }
  const result = new Set(); const visited = new Set([start]); let at = "__center__";
  while (at !== start && previous.has(at)) { const [parent, index] = previous.get(at); result.add(index); visited.add(parent); at = parent; }
  return { edges: result, nodes: visited };
}
function lineEnds(a, b, radiusA, radiusB) { const dx=b.x-a.x, dy=b.y-a.y, length=Math.hypot(dx,dy)||1; return [a.x+dx/length*radiusA,a.y+dy/length*radiusA,b.x-dx/length*radiusB,b.y-dy/length*radiusB]; }

export default function ProofConstellation() {
  const sectionRef = useRef(null); const sphereRef = useRef(null); const [active, setActive] = useState(null);
  const nodeRefs = useRef(new Map()); const edgeRefs = useRef(new Map()); const particleRefs = useRef([]);
  const nodes = useMemo(makeNodes, []); const edges = useMemo(() => makeEdges(nodes, mulberry32(1729)), [nodes]);
  const particles = useMemo(() => edges.map((edge, index) => ({ edge, index, duration: 3.5 + ((index * 37) % 25) / 10, phase: ((index * 19) % 31) / 31 })).filter(({ edge, index }) => edge.trunk && index % 2 === 0), [edges]);
  const route = active ? routeFor(active, edges) : null;

  useEffect(() => {
    const stage = sectionRef.current; if (!stage) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)"), points = new Map();
    let visible = true, raf = 0, last = 0;
    const nodeEls = new Map([...stage.querySelectorAll("[data-node]")].map((el) => [el.dataset.node, el]));
    const edgeEls = new Map([...stage.querySelectorAll("[data-edge]")].map((el) => [Number(el.dataset.edge), el]));
    const draw = (stamp) => {
      if (stamp-last<32) { raf=requestAnimationFrame(draw); return; } last=stamp;
      const seconds=stamp/1000;
      nodes.forEach((node) => { const amount=reduced.matches?0:3; const p={x:node.x+Math.sin(seconds*2*Math.PI/node.cycle+node.phase)*amount,y:node.y+Math.cos(seconds*2*Math.PI/(node.cycle+.8)+node.phase)*amount}; points.set(node.id,p); nodeEls.get(node.id)?.setAttribute("transform",`translate(${p.x} ${p.y})`); });
      edges.forEach((edge,index) => { const a=edge.a==="__center__"?CENTER:points.get(edge.a), b=edge.b==="__center__"?CENTER:points.get(edge.b); if(!a||!b)return; const [x1,y1,x2,y2]=lineEnds(a,b,edge.a==="__center__"?140:26,edge.b==="__center__"?140:26); const el=edgeEls.get(index); if(el){el.setAttribute("x1",x1);el.setAttribute("y1",y1);el.setAttribute("x2",x2);el.setAttribute("y2",y2);} });
      if (!reduced.matches) particles.forEach((particle,index) => { const node=points.get(particle.edge.a); if(!node)return; const [x1,y1,x2,y2]=lineEnds(node,CENTER,26,140); const elapsed=(seconds/particle.duration+particle.phase)%1; const progress=1-elapsed; const x=x1+(x2-x1)*progress,y=y1+(y2-y1)*progress,trail=Math.min(24,Math.hypot(x2-x1,y2-y1)*.2); const tx=x-(x2-x1)/Math.hypot(x2-x1,y2-y1)*trail,ty=y-(y2-y1)/Math.hypot(x2-x1,y2-y1)*trail; const el=particleRefs.current[index]; if(el){el.circle?.setAttribute("transform",`translate(${x} ${y})`);el.path?.setAttribute("d",`M${tx} ${ty}L${x} ${y}`);} if(elapsed<.012&&el.flashAt!==Math.floor(seconds)){el.flashAt=Math.floor(seconds);sphereRef.current?.classList.remove("pc-flash");requestAnimationFrame(()=>sphereRef.current?.classList.add("pc-flash"));} });
      raf=reduced.matches?0:requestAnimationFrame(draw);
    };
    const start=()=>{stage.classList.remove("pc-paused");if(!raf&&visible&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(draw);};
    const stop=()=>{cancelAnimationFrame(raf);raf=0;};
    const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&!document.hidden)start();else{stage.classList.add("pc-paused");stop();}},{threshold:.01});
    const visibility=()=>{if(document.hidden){stage.classList.add("pc-paused");stop();}else if(visible)start();};
    const motion=()=>{stage.classList.toggle("pc-still",reduced.matches);if(reduced.matches){stop();draw(performance.now());}else start();};
    observer.observe(stage);document.addEventListener("visibilitychange",visibility);reduced.addEventListener("change",motion);stage.classList.toggle("pc-still",reduced.matches);if(reduced.matches)draw(performance.now());else start();
    return()=>{stop();observer.disconnect();document.removeEventListener("visibilitychange",visibility);reduced.removeEventListener("change",motion);};
  },[nodes,edges,particles]);

  return <section ref={sectionRef} className="proof-constellation relative w-full overflow-hidden bg-transparent px-4 pb-12 pt-14 text-white sm:px-6 sm:pt-20">
    <style>{`
      @keyframes pc-float{0%,100%{transform:translateY(-4px)}50%{transform:translateY(4px)}}
      @keyframes pc-shimmer{0%,72%,100%{transform:translateX(-180%) rotate(24deg);opacity:0}78%{opacity:.55}90%{transform:translateX(180%) rotate(24deg);opacity:0}}
      @keyframes pc-flash{0%,100%{box-shadow:0 0 60px rgba(2,151,222,.5),0 16px 42px rgba(252,115,77,.2),inset 0 2px 7px rgba(255,255,255,.6),inset 0 -8px 28px rgba(2,151,222,.35)}45%{box-shadow:0 0 78px rgba(2,151,222,.7),0 16px 50px rgba(252,115,77,.34),inset 0 2px 8px rgba(255,255,255,.8),inset 0 -8px 28px rgba(2,151,222,.42)}}
      .pc-stage{position:relative;width:min(100%,960px);aspect-ratio:960/620;margin:30px auto 0;}
      .pc-svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
      .pc-edge{stroke:url(#pc-gradient);stroke-width:1.6;stroke-dasharray:2 6;stroke-linecap:round;filter:url(#pc-glow);transition:opacity .2s}
      .pc-node{cursor:pointer;outline:none;transition:opacity .2s}.pc-node circle{fill:rgba(6,17,27,.9);stroke:var(--brand);stroke-width:2;filter:drop-shadow(0 0 7px var(--brand));transition:stroke-width .2s,filter .2s}.pc-node:hover circle,.pc-node:focus-visible circle{stroke:#fff;stroke-width:3;filter:drop-shadow(0 0 14px var(--brand))}
      .pc-label{opacity:.92;transition:opacity .2s}
      .pc-particle{fill:#eafaff;filter:url(#pc-particle-glow)}.pc-trail{stroke:url(#pc-trail-gradient);stroke-width:3;stroke-linecap:round;filter:url(#pc-particle-glow)}
      .pc-sphere{position:absolute;left:50%;top:50%;width:29.1667%;aspect-ratio:1;transform:translate(-50%,-50%);display:grid;place-items:center;overflow:hidden;border:1.5px solid rgba(255,255,255,.45);border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(255,255,255,.28),rgba(2,151,222,.18));backdrop-filter:blur(18px) saturate(180%);-webkit-backdrop-filter:blur(18px) saturate(180%);box-shadow:0 0 60px rgba(2,151,222,.5),0 16px 42px rgba(252,115,77,.2),inset 0 2px 7px rgba(255,255,255,.6),inset 0 -8px 28px rgba(2,151,222,.35)}
      .pc-sphere:before{content:"";position:absolute;inset:6% auto auto 6%;width:43%;height:43%;border-radius:50%;border-top:2px solid rgba(255,255,255,.7);border-left:2px solid rgba(255,255,255,.56);transform:rotate(-25deg);filter:blur(.4px)}
      .pc-sphere:after{content:"";position:absolute;left:12%;top:12%;width:10px;height:10px;border-radius:50%;background:rgba(255,255,255,.86);box-shadow:0 0 12px rgba(255,255,255,.8)}
      .pc-mascot{position:relative;z-index:1;width:55%;height:auto;animation:pc-float 6s ease-in-out infinite;filter:drop-shadow(0 10px 10px rgba(0,0,0,.38)) drop-shadow(0 0 12px rgba(2,151,222,.34))}
      .pc-shimmer{position:absolute;z-index:2;inset:-20% auto -20% 0;width:35%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);filter:blur(9px);animation:pc-shimmer 8s ease-in-out infinite}
      .pc-sphere.pc-flash{animation:pc-flash .4s ease-out}
      .pc-tag{position:absolute;left:50%;top:calc(50% + 15% + 9px);transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:3px;white-space:nowrap;border:1px solid rgba(220,240,255,.22);border-radius:999px;background:rgba(2,8,20,.86);padding:7px 14px;color:#f4faff;font:700 12px/1 ui-monospace,monospace;letter-spacing:2px}
      .pc-tag small{font-size:8px;letter-spacing:1.5px;color:#b7c7d7}
      .proof-constellation.pc-paused .pc-mascot,.proof-constellation.pc-paused .pc-shimmer{animation-play-state:paused}
      .proof-constellation.pc-still .pc-mascot,.proof-constellation.pc-still .pc-shimmer{animation:none}
      @media(max-width:767px){.proof-constellation{padding-top:3rem}.pc-stage{margin-top:22px}.pc-sphere{width:29.1667%}.pc-label{opacity:0}.pc-node:hover .pc-label,.pc-node:focus .pc-label,.pc-node:focus-visible .pc-label{opacity:1}}
      @media(prefers-reduced-motion:reduce){.pc-mascot,.pc-shimmer,.pc-sphere.pc-flash{animation:none!important}.pc-node,.pc-edge,.pc-label{transition:none!important}}
    `}</style>
    <header className="relative z-[1] mx-auto max-w-4xl text-center">
      <h2 className="font-serif text-[clamp(2.4rem,5.84vw,3.5rem)] leading-[1.05] tracking-tight text-white">One profile. Every proof.</h2>
      <p className="mt-4 text-base leading-relaxed text-gray-400">Code, platforms and skills, all connected to a single verified profile.</p>
    </header>
    <div className="pc-stage" role="group" aria-label="A star chart connecting verified platforms and skills to the ORIO profile">
      <svg className="pc-svg" viewBox="0 0 960 620" role="presentation">
        <defs>
          <linearGradient id="pc-gradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7FD8FF"/><stop offset="100%" stopColor="#FF8A4C"/></linearGradient>
          <linearGradient id="pc-trail-gradient" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#7FD8FF" stopOpacity="0"/><stop offset="100%" stopColor="#fff" stopOpacity=".95"/></linearGradient>
          <filter id="pc-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="blur"/><feComponentTransfer in="blur" result="glow"><feFuncA type="linear" slope=".5"/></feComponentTransfer><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          <filter id="pc-particle-glow" x="-400%" y="-400%" width="900%" height="900%"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <g>{edges.map((edge,index)=>{const a=edge.a==="__center__"?CENTER:nodes.find(n=>n.id===edge.a),b=edge.b==="__center__"?CENTER:nodes.find(n=>n.id===edge.b);const [x1,y1,x2,y2]=lineEnds(a,b,edge.a==="__center__"?140:26,edge.b==="__center__"?140:26);const lit=route?.edges.has(index);return <line key={index} ref={el=>el&&edgeRefs.current.set(index,el)} className="pc-edge" data-edge={index} x1={x1} y1={y1} x2={x2} y2={y2} style={{opacity:active?(lit?1:.25):.95}}/>})}</g>
        {particles.map((particle,index)=><g key={`particle-${index}`} ref={el=>{if(el)particleRefs.current[index]={circle:el.querySelector("circle"),path:el.querySelector("path"),flashAt:-1}}}>
          <path className="pc-trail" d="M0 0L0 0"/><circle className="pc-particle" r="3" transform="translate(0 0)"/>
        </g>)}
        {nodes.map(node=><a key={node.id} href={node.url} target="_blank" rel="noopener noreferrer" aria-label={node.name} className="pc-node" data-node={node.id} transform={`translate(${node.x} ${node.y})`} style={{"--brand":node.brand,opacity:active?(route?.nodes.has(node.id)?1:.25):1}} onMouseEnter={()=>setActive(node.id)} onMouseLeave={()=>setActive(null)} onFocus={()=>setActive(node.id)} onBlur={()=>setActive(null)}>
          <circle r="26"/><image href={LOGOS[node.id]} x="-14" y="-14" width="28" height="28" preserveAspectRatio="xMidYMid meet"/>
          <g className="pc-label" transform="translate(0 34)"><rect x={-Math.max(44,node.name.length*4.2+12)} y="0" width={Math.max(88,node.name.length*8.4+24)} height="22" rx="11" fill="rgba(2,7,10,.75)" stroke="rgba(220,240,255,.22)"/><text y="15" textAnchor="middle" fill="#E6F4FF" fontFamily="ui-monospace,monospace" fontSize="11" letterSpacing="1.5" fontWeight="700">{node.name.toUpperCase()}</text></g>
        </a>)}
      </svg>
      <div ref={sphereRef} className="pc-sphere" aria-hidden="true"><span className="pc-shimmer"/><Mascot className="pc-mascot" title=""/></div>
      <div className="pc-tag" aria-hidden="true">ORIO<small>VERIFIED PROFILE</small></div>
    </div>
  </section>;
}
