import { Outlet } from "react-router-dom";
import LandingNav from "../components/landing/LandingNav";
import LandingFooter from "../components/landing/LandingFooter";

/**
 * Public experience shell — fixed glass navigation over an atmospheric
 * canvas, content via children or nested routes, footer.
 */
export default function PublicLayout({ children }) {
  return (
    <div className="min-h-dvh bg-canvas bg-atmosphere text-ink-hi">
      <LandingNav />
      <main>{children ?? <Outlet />}</main>
      <LandingFooter />
    </div>
  );
}
