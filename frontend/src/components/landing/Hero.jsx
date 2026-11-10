import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";
import Constellation from "./Constellation";

/* -------------------------------------------------------
   BACKGROUND: REEDED-GLASS FLAME (WebGL)

   The scene is a navy sky with a blue lobe (left), an
   orange lobe (right) and a hot seam between them, rising
   from the bottom edge. It is viewed "through" ribbed glass:
   every vertical rib acts as a small cylindrical lens that
   re-samples the scene with a mirrored offset, a slight RGB
   split and even edge shading. Ribs are perfectly regular;
   all motion is a smooth sway and breathe of the flame shape.
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
uniform float uDpr;   // device pixel ratio

const vec3 SKY_TOP = vec3(0.010, 0.035, 0.150);
const vec3 SKY_MID = vec3(0.008, 0.025, 0.110);
const vec3 SKY_LOW = vec3(0.004, 0.012, 0.055);
const vec3 BLUE    = vec3(0.120, 0.660, 1.000);  // #0297DE family
const vec3 ORANGE  = vec3(1.000, 0.420, 0.170);  // #FC734D family
const vec3 CORAL   = vec3(0.960, 0.260, 0.380);
const vec3 HOT     = vec3(1.000, 0.840, 0.860);

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
  return exp(-dx * dx) * pow(clamp(1.0 - y / h, 0.0, 1.0), 1.25);
}

// Each lobe is blended OVER the sky (mix), not added to it, so the hues
// stay saturated instead of washing out to pink.
vec3 scene(float x, float y, float hv, float streak, float sway) {
  vec3 col = mix(SKY_LOW, SKY_MID, smoothstep(0.0, 0.5, y));
  col = mix(col, SKY_TOP, smoothstep(0.4, 1.0, y));

  float blue    = lobe(x, y, 0.40 + sway, 0.21, 0.56 * hv);
  float orange  = lobe(x, y, 0.60 - sway, 0.21, 0.50 * hv);
  float core    = lobe(x, y, 0.50, 0.06, 0.38 * hv);
  float spread  = lobe(x, y, 0.50, 0.52, 0.36);
  float coralL  = lobe(x, y, 0.08, 0.20, 0.26 * hv);
  float orangeR = lobe(x, y, 0.93, 0.20, 0.26 * hv);

  float hx = (x - 0.5) / 0.25;
  float haze = exp(-hx * hx) * (1.0 - smoothstep(0.25, 0.80, y));

  float wB = clamp(blue * 1.35 + spread * 0.85, 0.0, 1.0) * streak;
  float wO = clamp(orange * 1.45 + orangeR * 0.70, 0.0, 1.0) * streak;
  float wC = clamp(coralL * 0.70, 0.0, 1.0);

  col = mix(col, vec3(0.22, 0.45, 0.95), haze * 0.20);
  col = mix(col, BLUE, wB);
  col = mix(col, CORAL, wC);
  col = mix(col, ORANGE, wO);
  col += HOT * (core * 0.45 + 0.22 * wB * wO);   // soft seam where blue meets orange
  return col;
}

// One candidate star per ~56 css px cell, twinkling. Drawn after the ribs so
// stars stay crisp, and only where the sky is dark.
float stars(vec2 frag, float t) {
  float cell = 56.0 * uDpr;
  vec2 g = floor(frag / cell);
  vec2 f = frag / cell - g;
  float h = hash21(g + 7.3);
  vec2 p = vec2(hash21(g + 1.7), hash21(g + 9.1)) * 0.7 + 0.15;
  float d = length((f - p) * cell) / uDpr;
  float size = 0.60 + 1.1 * hash21(g + 4.4);
  float core = 1.0 - smoothstep(0.0, size, d);
  float tw = 0.65 + 0.35 * sin(t * (0.6 + 1.4 * hash21(g + 2.2)) + h * 40.0);
  float gate = step(0.72, h);
  return core * tw * gate * (0.5 + 0.5 * hash21(g + 5.5));
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

  // Flame shape is smooth across x (noise is sampled at low frequency),
  // so neighbouring ribs always agree. No per-rib randomness.
  float sway   = 0.012 * sin(uTime * 0.5);
  float hv     = 0.92 + 0.16 * fbm(vec2(cx * 3.0, uTime * 0.10))
                      + 0.04 * sin(uTime * 0.8 + cx * 5.0);
  float streak = 0.90 + 0.20 * vnoise(vec2(cx * 18.0, y * 2.0 - uTime * 0.30));

  // gentle cylindrical lens: mirrored re-sample of the scene, small RGB split
  float span = 3.2 * ribUv;
  float disp = 0.15;
  vec3 col;
  col.r = scene(cx - c * span * (1.0 + disp), y, hv, streak, sway).r;
  col.g = scene(cx - c * span,                y, hv, streak, sway).g;
  col.b = scene(cx - c * span * (1.0 - disp), y, hv, streak, sway).b;

  // even rib shading and a faint edge glint
  float shade = 0.88 + 0.12 * cos(c * 1.5708);
  float glint = smoothstep(0.78, 1.0, abs(c));
  col *= shade;
  col += glint * 0.012 * (0.4 + col);

  // stars, only over the dark sky
  float lum = dot(col, vec3(0.30, 0.55, 0.15));
  col += vec3(0.75, 0.85, 1.00) * stars(frag, uTime) * (1.0 - smoothstep(0.10, 0.45, lum)) * 1.5;

  // grain hides gradient banding
  col += (hash21(frag) - 0.5) * 0.012;

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
    const uDpr = gl.getUniformLocation(prog, "uDpr");

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
      gl.uniform1f(uDpr, dpr);
      // rib width in CSS px: finer on phones
      gl.uniform1f(uRib, (canvas.clientWidth < 640 ? 5 : 7) * dpr);
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
        ORIONET turns verified work into explainable capability signals.
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

      {/* CONSTELLATION: floats behind the content, hub sits above Proof Core */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[920px] overflow-hidden md:block"
      >
        <Constellation />
      </div>

      {/* MAIN CONTENT */}

      <HeroContent />

      {/* STATS AND BUTTON */}

      <HeroStats />

      {/* HORIZON: reserved space so the flame and the constellation hub sit
          below the stats row on any screen height */}

      <div aria-hidden="true" className="mt-auto h-[170px] w-full md:h-[300px]" />
    </section>
  );
}
