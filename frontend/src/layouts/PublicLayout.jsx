import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import LandingNav from "../components/landing/LandingNav";
import LandingFooter from "../components/landing/LandingFooter";

const SmoothScroll = lazy(() => import("../components/SmoothScroll"));

export default function PublicLayout({ children }) {
  const content = children ?? <Outlet />;
  return (
    <div className="relative min-h-dvh text-stellar">
      <LandingNav />
      <Suspense fallback={<main className="relative z-[1]">{content}</main>}>
        <SmoothScroll>
          <main className="relative z-[1]">{content}</main>
        </SmoothScroll>
      </Suspense>
      <div className="relative z-[1]">
        <LandingFooter />
      </div>
    </div>
  );
}
