import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import LandingNav from "../components/landing/LandingNav";
import LandingFooter from "../components/landing/LandingFooter";

/**
 * Public experience shell — fixed glass navigation over an atmospheric
 * canvas, content via children or nested routes, footer.
 */
export default function PublicLayout({ children }) {
  const shellRef = useRef(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || window.matchMedia("(pointer: coarse)").matches) return undefined;

    const updateSpotlight = (event) => {
      const bounds = shell.getBoundingClientRect();
      shell.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
      shell.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
    };

    window.addEventListener("pointermove", updateSpotlight, { passive: true });
    return () => window.removeEventListener("pointermove", updateSpotlight);
  }, []);

  return (
    <div ref={shellRef} className="public-atmosphere min-h-dvh bg-canvas text-stellar">
      <div className="public-spotlight" aria-hidden="true" />
      <LandingNav />
      <main className="relative z-[1]">{children ?? <Outlet />}</main>
      <div className="relative z-[1]">
        <LandingFooter />
      </div>
    </div>
  );
}
