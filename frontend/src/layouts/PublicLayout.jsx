import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { BackgroundBeams } from "../components/ui/background-beams";
import { Particles } from "../components/ui/particles";
import LandingNav from "../components/landing/LandingNav";
import LandingFooter from "../components/landing/LandingFooter";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

/**
 * Public experience shell — cinematic FluxEdit canvas: volumetric spotlight,
 * animated beams, floating particles, and film grain behind the content.
 */
export default function PublicLayout({ children }) {
  const glowRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow || reducedMotion) return undefined;
    const onPointerMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      glow.style.translate = `${x * 14}px ${y * 10}px`;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reducedMotion]);

  return (
    <div className="flux-environment text-stellar">
      <div ref={glowRef} className="flux-volumetric transition-[translate] duration-500 ease-out" aria-hidden="true" />
      <div className="flux-backdrop" aria-hidden="true">
        <BackgroundBeams />
        <Particles
          className="absolute inset-0 opacity-40"
          quantity={50}
          staticity={50}
          ease={50}
        />
      </div>
      <LandingNav />
      <main className="relative z-[1]">{children ?? <Outlet />}</main>
      <div className="relative z-[1]">
        <LandingFooter />
      </div>
      <div className="flux-film-grain" aria-hidden="true" />
    </div>
  );
}
