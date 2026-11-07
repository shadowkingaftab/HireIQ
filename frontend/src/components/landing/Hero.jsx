import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

/* -------------------------------------------------------
   PANEL CONFIGURATION
------------------------------------------------------- */

const panelClass =
  "relative flex flex-col justify-between overflow-hidden rounded-t-2xl border border-white/10 border-b-0 border-t-white/20 bg-[#06111B]/80 p-6 backdrop-blur-xl shadow-2xl";

/* -------------------------------------------------------
   BACKGROUND: REEDED-GLASS FLAME (WebGL)

   The scene is a navy sky with a blue lobe (left), an
   orange lobe (right) and a hot seam between them, rising
   from the bottom edge. It is viewed "through" ribbed glass:
   every vertical rib acts as a small cylindrical lens that
   re-samples the scene with a mirrored offset, a slight RGB
   split, edge shading and a per-rib flicker. That lens step
   is what produces the strip texture in the reference.
------------------------------------------------------- */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2  uRes;   // drawing-buffer size, px
uniform float uTime;  // seconds
uniform float uRib;   // rib width, device px

const vec3 SKY_TOP = vec3(0.035, 0.135, 0.440);
const vec3 SKY_MID = vec3(0.020, 0.075, 0.260);
const vec3 SKY_LOW = vec3(0.008, 0.028, 0.110);
const vec3 BLUE    = vec3(0.020, 0.580, 1.000);  // #0297DE family
const vec3 ORANGE  = vec3(1.000, 0.360, 0.220);  // #FC734D family
const vec3 CORAL   = vec3(0.950, 0.250, 0.400);
const vec3 HOT     = vec3(1.000, 0.900, 0.800);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * vnoise(p);
    p = p * 2.02 + vec2(17.1, 9.7);
    a *= 0.5;
  }
  return v / 0.875;
}

// Gaussian across x, power falloff up the y axis. y = 0 is the bottom edge.
float lobe(float x, float y, float cx, float w, float h) {
  float dx = (x - cx) / w;
  return exp(-dx * dx) * pow(clamp(1.0 - y / h, 0.0, 1.0), 1.7);
}

vec3 scene(float x, float y, float hv, float streak) {
  vec3 col = mix(SKY_LOW, SKY_MID, smoothstep(0.0, 0.5, y));
  col = mix(col, SKY_TOP, smoothstep(0.4, 1.0, y));

  float blue    = lobe(x, y, 0.405, 0.15, 0.58 * hv);
  float orange  = lobe(x, y, 0.595, 0.15, 0.52 * hv);
  float core    = lobe(x, y, 0.500, 0.045, 0.36 * hv);
  float spread  = lobe(x, y, 0.500, 0.52, 0.30);
  float coralL  = lobe(x, y, 0.080, 0.20, 0.26 * hv);
  float orangeR = lobe(x, y, 0.930, 0.20, 0.24 * hv);

  float hx = (x - 0.5) / 0.25;
  float haze = exp(-hx * hx) * (1.0 - smoothstep(0.25, 0.80, y));

  col += vec3(0.20, 0.40, 0.85) * haze * 0.10;
  col += BLUE   * (blue * 1.25 + spread * 0.32) * streak;
  col += ORANGE * (orange * 1.35 + orangeR * 0.55) * streak;
  col += CORAL  * coralL * 0.55;
  col += HOT    * core * 0.90;
  return col;
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  float y = frag.y / uRes.y;

  // rib coordinates
  float xr    = frag.x / uRib;
  float idx   = floor(xr);
  float c     = fract(xr) * 2.0 - 1.0;          // -1 .. 1 across one rib
  float ribUv = uRib / uRes.x;
  float cx    = (idx + 0.5) * ribUv;

  // per-rib flicker: neighbours move together, each rib also jitters a little
  float slow = fbm(vec2(idx * 0.07, uTime * 0.12));
  float fast = vnoise(vec2(idx * 0.8, uTime * 0.9));
  float hv = 0.78 + 0.50 * slow + 0.07 * fast;

  float streak = 0.82 + 0.36 * vnoise(vec2(idx * 0.5, y * 3.0 - uTime * 0.35));
  streak *= 0.97 + 0.03 * sin(uTime * 0.9);

  // cylindrical lens: mirrored re-sample of the scene, split per channel
  float span = 6.0 * ribUv;
  float disp = 0.28;
  vec3 col;
  col.r = scene(cx - c * span * (1.0 + disp), y, hv, streak).r;
  col.g = scene(cx - c * span,                y, hv, streak).g;
  col.b = scene(cx - c * span * (1.0 - disp), y, hv, streak).b;

  // rib shading and edge glint
  float shade = 0.80 + 0.20 * cos(c * 1.5708);
  float glint = smoothstep(0.78, 1.0, abs(c));
  col *= shade * (0.93 + 0.14 * hash21(vec2(idx, 3.7)));
  col += glint * 0.025 * (0.4 + col);

  // soft highlight roll-off, then grain to hide gradient banding
  col = 1.0 - exp(-col * 1.35);
  col += (hash21(frag) - 0.5) * 0.03;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/* Static CSS version, used only if WebGL is unavailable. */

const fallbackRibMask =
  "repeating-linear-gradient(90deg, #000 0px, #000 2px, rgba(0,0,0,0.22) 2px, rgba(0,0,0,0.22) 4px)";

const fallbackGlow = [
  "radial-gradient(ellipse 13% 58% at 50% 100%, rgba(255,244,238,0.98) 0%, rgba(255,205,185,0.6) 40%, transparent 100%)",
  "radial-gradient(ellipse 34% 66% at 63% 100%, rgba(255,128,92,0.98) 0%, rgba(252,115,77,0.62) 36%, rgba(252,115,77,0.2) 68%, transparent 100%)",
  "radial-gradient(ellipse 34% 66% at 37% 100%, rgba(46,184,255,0.98) 0%, rgba(2,151,222,0.62) 36%, rgba(2,151,222,0.2) 68%, transparent 100%)",
  "radial-gradient(ellipse 78% 42% at 50% 100%, rgba(2,151,222,0.5) 0%, rgba(2,151,222,0.18) 55%, transparent 100%)",
].join(", ");

function StaticGlow() {
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, #0B2B5E 0%, #0A2352 30%, #071A3E 55%, #040E20 80%, #02070A 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: fallbackGlow,
          maskImage: fallbackRibMask,
          WebkitMaskImage: fallbackRibMask,
        }}
      />
    </>
  );
}

function FlameEnvironment() {
  const canvasRef = useRef(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      setFallback(true);
      return undefined;
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      setFallback(true);
      return undefined;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallback(true);
      return undefined;
    }
    gl.useProgram(prog);

    // one oversized triangle covers the viewport
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uRib = gl.getUniformLocation(prog, "uRib");

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const t0 = performance.now();
    let raf = 0;
    let last = 0;
    let onScreen = true;

    const draw = (now) => {
      gl.uniform1f(uTime, motion.matches ? 4.0 : (now - t0) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      // rib width in CSS px: finer on phones
      gl.uniform1f(uRib, (canvas.clientWidth < 640 ? 6 : 9) * dpr);
      draw(performance.now());
    };

    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 33) return; // ~30 fps is plenty for a slow flicker
      last = now;
      draw(now);
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
      draw(performance.now());
      start();
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onLost = (e) => {
      e.preventDefault();
      stop();
      setFallback(true);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);

    motion.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", onLost);

    resize();
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      motion.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#02070A]"
    >
      {fallback ? (
        <StaticGlow />
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
    </div>
  );
}

/* -------------------------------------------------------
   HERO TEXT
------------------------------------------------------- */

function HeroContent() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 pt-40 text-center">
      <h1 className="font-serif text-6xl leading-[0.95] tracking-tighter text-white sm:text-7xl md:text-8xl">
        Don&apos;t just claim,
        <br />

        <span className="mt-2 inline-block italic text-[#0297DE] drop-shadow-[0_0_30px_rgba(2,151,222,0.6)]">
          Prove it.
        </span>
      </h1>

      <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400 sm:text-base">
        ProofHire turns verified work into explainable capability signals.
        Recruiters see demonstrated skill, and every score traces back to its
        evidence.
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   THREE-COLUMN STATS & CTA
------------------------------------------------------- */

function HeroStats() {
  return (
    <div className="relative z-10 mx-auto mt-12 grid w-full max-w-2xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-6 sm:gap-6">
      {/* LEFT STAT */}

      <div className="flex min-w-0 flex-col items-end text-right">
        <span className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
          100%
        </span>

        <span className="mt-2 text-[8px] uppercase tracking-[0.15em] text-gray-500 sm:text-[10px] sm:tracking-widest">
          Evidence Backed
        </span>
      </div>

      {/* CENTER CTA */}

      <div className="flex justify-center">
        <Button
          to="/signup"
          className="whitespace-nowrap rounded-full border-0 bg-[#0297DE] px-4 py-3 text-xs font-semibold text-white shadow-[0_0_40px_rgba(2,151,222,0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_55px_rgba(2,151,222,0.8)] sm:px-8 sm:text-sm"
        >
          Build your proof
        </Button>
      </div>

      {/* RIGHT STAT */}

      <div className="flex min-w-0 flex-col items-start text-left">
        <span className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
          94
        </span>

        <span className="mt-2 text-[8px] uppercase tracking-[0.15em] text-gray-500 sm:text-[10px] sm:tracking-widest">
          Match Score
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   REPOSITORY PANEL
------------------------------------------------------- */

function RepositoryPanel() {
  return (
    <div className={`${panelClass} h-[240px]`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Repository
        </p>

        <p className="mt-2 text-sm font-medium text-gray-200">
          Verified contribution
        </p>
      </div>

      <div className="relative rounded-xl border border-white/10 bg-[#02070A]/80 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#0297DE] shadow-[0_0_14px_rgba(2,151,222,0.9)]" />

          <span className="h-1.5 w-24 rounded-full bg-white/20" />
        </div>

        <div className="space-y-3">
          <span className="block h-1.5 w-full rounded-full bg-white/10" />
          <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
          <span className="block h-1.5 w-3/5 rounded-full bg-white/10" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   PROOF CORE PANEL
------------------------------------------------------- */

function ProofCorePanel() {
  return (
    <div
      className={`${panelClass} z-10 h-[280px] items-center border-[#0297DE]/40 bg-[#06111B]/90 text-center shadow-[0_-20px_80px_rgba(252,115,77,0.2)]`}
    >
      <p className="self-start font-mono text-xs uppercase tracking-[0.2em] text-gray-400">
        Proof Core
      </p>

      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-[#0297DE]/40 bg-[radial-gradient(circle,rgba(2,151,222,0.18),transparent_70%)] shadow-[0_0_50px_rgba(2,151,222,0.25)]">
        <div className="absolute inset-2 rounded-full border border-[#0297DE]/30" />

        <div className="absolute inset-5 rounded-full border border-dashed border-[#0297DE]/40" />

        <div className="h-10 w-10 rounded-full bg-[#0297DE] shadow-[0_0_35px_#0297DE,0_0_60px_rgba(2,151,222,0.5)]" />
      </div>

      <p className="text-xs text-gray-300">
        Evidence connected to skill
      </p>
    </div>
  );
}

/* -------------------------------------------------------
   CAPABILITY SIGNAL PANEL
------------------------------------------------------- */

function CapabilityPanel() {
  return (
    <div className={`${panelClass} h-[240px]`}>
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
          Capability Signal
        </p>

        <p className="mt-2 text-sm font-medium text-gray-200">
          Match score
        </p>
      </div>

      <div className="space-y-5 rounded-xl border border-white/10 bg-[#02070A]/80 p-5">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-[#FC734D] shadow-[0_0_14px_rgba(252,115,77,0.9)]" />

          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
            <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#0297DE] to-[#42C9FF]" />
          </div>
        </div>

        <span className="block h-1.5 w-2/3 rounded-full bg-white/10" />

        <span className="block h-1.5 w-5/6 rounded-full bg-white/10" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN HERO COMPONENT
------------------------------------------------------- */

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#02070A] text-white"
    >
      {/* BACKGROUND */}

      <FlameEnvironment />

      {/* MAIN CONTENT */}

      <HeroContent />

      {/* STATS AND BUTTON */}

      <HeroStats />

      {/* BOTTOM SHELF */}

      <div className="relative z-10 mx-auto mt-20 w-full max-w-6xl px-6 pb-0">
        <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-3">
          <RepositoryPanel />

          <ProofCorePanel />

          <CapabilityPanel />
        </div>
      </div>
    </section>
  );
}