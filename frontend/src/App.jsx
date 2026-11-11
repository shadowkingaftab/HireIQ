import { lazy, Suspense, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import ProtectedRoute from './routes/ProtectedRoute';
import CandidateRoute from './routes/CandidateRoute';
import RecruiterRoute from './routes/RecruiterRoute';
import AdminRoute from './routes/AdminRoute';
import AppShell from './components/layout/AppShell';
import PublicLayout from './layouts/PublicLayout';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile'));
const Capabilities = lazy(() => import('./pages/Capabilities'));
const EvidenceExplorer = lazy(() => import('./pages/EvidenceExplorer'));
const Assessments = lazy(() => import('./pages/Assessments'));
const AssessmentRunner = lazy(() => import('./pages/AssessmentRunner'));
const AssessmentResults = lazy(() => import('./pages/AssessmentResults'));
const Matches = lazy(() => import('./pages/Matches'));
const RecruiterMatches = lazy(() => import('./pages/RecruiterMatches'));
const MatchDetail = lazy(() => import('./pages/MatchDetail'));
const Applications = lazy(() => import('./pages/Applications'));
const Activity = lazy(() => import('./pages/Activity'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Settings = lazy(() => import('./pages/Settings'));
const Integrations = lazy(() => import('./pages/Integrations'));
const CandidateSearch = lazy(() => import('./pages/CandidateSearch'));
const CandidateDirectory = lazy(() => import('./pages/CandidateDirectory'));
const CandidateComparison = lazy(() => import('./pages/CandidateComparison'));
const Jobs = lazy(() => import('./pages/Jobs'));
const JobBuilder = lazy(() => import('./pages/JobBuilder'));
const JobDetails = lazy(() => import('./pages/JobDetails'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

function page(Component, props) {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-ink-muted" role="status">Loading page…</div>}>
      <Component {...props} />
    </Suspense>
  );
}

function RoleMatches() {
  const role = useAuthStore((state) => state.user?.role);
  if (role === "candidate") return page(Matches);
  if (role === "recruiter" || role === "admin") return page(RecruiterMatches);
  return <Navigate to="/login" replace />;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  const backgroundRef = useRef(null);
  const noiseOffsetRef = useRef(null);
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  useEffect(() => {
    const background = backgroundRef.current;
    const noiseOffset = noiseOffsetRef.current;
    if (!background || !noiseOffset) return undefined;

    let frame = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const target = { x: 0, y: 0, scroll: 0 };
    const current = { ...target };

    const animateInput = () => {
      frame = 0;
      if (motion.matches) return;

      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      current.scroll += (target.scroll - current.scroll) * 0.16;
      background.style.setProperty("--orionet-pointer-x", `${current.x.toFixed(2)}px`);
      background.style.setProperty("--orionet-pointer-y", `${current.y.toFixed(2)}px`);
      background.style.setProperty("--orionet-scroll-shift", `${current.scroll.toFixed(2)}px`);
      noiseOffset.setAttribute("dx", (current.x * 0.45).toFixed(2));
      noiseOffset.setAttribute("dy", (current.y * 0.45 + current.scroll * 0.2).toFixed(2));

      if (
        Math.abs(target.x - current.x) > 0.05 ||
        Math.abs(target.y - current.y) > 0.05 ||
        Math.abs(target.scroll - current.scroll) > 0.05
      ) {
        frame = requestAnimationFrame(animateInput);
      }
    };

    const scheduleUpdate = () => {
      if (!frame && !motion.matches) frame = requestAnimationFrame(animateInput);
    };

    const onPointerMove = (event) => {
      if (event.pointerType === "touch" || motion.matches) return;
      target.x = ((event.clientX / window.innerWidth) - 0.5) * 10;
      target.y = ((event.clientY / window.innerHeight) - 0.5) * 8;
      scheduleUpdate();
    };

    const resetPointer = (event) => {
      if (event.relatedTarget) return;
      target.x = 0;
      target.y = 0;
      scheduleUpdate();
    };

    const onScroll = () => {
      target.scroll = motion.matches ? 0 : -Math.min(window.scrollY * 0.004, 14);
      scheduleUpdate();
    };

    const onMotionChange = () => {
      if (motion.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        target.x = target.y = target.scroll = current.x = current.y = current.scroll = 0;
        background.style.setProperty("--orionet-pointer-x", "0px");
        background.style.setProperty("--orionet-pointer-y", "0px");
        background.style.setProperty("--orionet-scroll-shift", "0px");
        noiseOffset.setAttribute("dx", "0");
        noiseOffset.setAttribute("dy", "0");
      } else {
        onScroll();
      }
    };

    onScroll();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", resetPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    motion.addEventListener("change", onMotionChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", resetPointer);
      window.removeEventListener("scroll", onScroll);
      motion.removeEventListener("change", onMotionChange);
    };
  }, []);

  return (
    <div className="relative isolate min-h-dvh">
      <div className={`orionet-background${isLanding ? " orionet-background--landing" : ""}`} aria-hidden="true">
        <img ref={backgroundRef} className="orionet-original-art" src="/orionet-background.png" alt="" />
        <svg className="orionet-filter-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <filter id="orionet-gesture-flow" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="1" seed="6" result="flameNoise" />
            <feOffset ref={noiseOffsetRef} in="flameNoise" dx="0" dy="0" result="movingNoise" />
            <feDisplacementMap in="SourceGraphic" in2="movingNoise" scale="5" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </div>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              {page(Home)}
            </PublicLayout>
          }
        />
        <Route path="/login" element={page(Login)} />
        <Route path="/signup" element={page(Signup)} />

        {/* Authenticated shell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={page(Dashboard)} />

          {/* Candidate surfaces */}
          <Route path="/profile" element={<CandidateRoute>{page(CandidateProfile)}</CandidateRoute>} />
          <Route path="/capabilities" element={<CandidateRoute>{page(Capabilities)}</CandidateRoute>} />
          <Route path="/evidence" element={<CandidateRoute>{page(EvidenceExplorer)}</CandidateRoute>} />
          <Route path="/assessments" element={<CandidateRoute>{page(Assessments)}</CandidateRoute>} />
          <Route path="/matches" element={page(RoleMatches)} />
          <Route path="/matches/:jobId" element={<CandidateRoute>{page(MatchDetail)}</CandidateRoute>} />
          <Route path="/applications" element={<CandidateRoute>{page(Applications)}</CandidateRoute>} />
          <Route path="/activity" element={<CandidateRoute>{page(Activity)}</CandidateRoute>} />

          {/* Recruiter surfaces */}
          <Route path="/candidates" element={<RecruiterRoute>{page(CandidateDirectory)}</RecruiterRoute>} />
          <Route path="/candidates/search" element={<RecruiterRoute>{page(CandidateSearch)}</RecruiterRoute>} />
          <Route path="/candidates/:candidateId" element={<RecruiterRoute>{page(CandidateProfile, { recruiterView: true })}</RecruiterRoute>} />
          <Route path="/candidates/:candidateId/match/:jobId" element={<RecruiterRoute>{page(CandidateProfile, { recruiterView: true, focus: "match" })}</RecruiterRoute>} />
          <Route path="/compare" element={<RecruiterRoute>{page(CandidateComparison)}</RecruiterRoute>} />
          <Route path="/jobs" element={<RecruiterRoute>{page(Jobs)}</RecruiterRoute>} />
          <Route path="/jobs/new" element={<RecruiterRoute>{page(JobBuilder)}</RecruiterRoute>} />
          <Route path="/jobs/:jobId" element={<RecruiterRoute>{page(JobDetails)}</RecruiterRoute>} />
          <Route path="/analytics" element={<RecruiterRoute>{page(Analytics)}</RecruiterRoute>} />
          <Route path="/reports" element={<RecruiterRoute>{page(Reports)}</RecruiterRoute>} />

          {/* Shared surfaces */}
          <Route path="/assessments/:assessmentId/results" element={<CandidateRoute>{page(AssessmentResults)}</CandidateRoute>} />
          <Route path="/notifications" element={page(Notifications)} />
          <Route path="/integrations" element={page(Integrations)} />
          <Route path="/settings" element={page(Settings)} />

          {/* Admin */}
          <Route path="/admin" element={<AdminRoute>{page(AdminDashboard)}</AdminRoute>} />

          <Route path="*" element={page(NotFound)} />
        </Route>

        {/* Immersive assessment runner — outside the shell chrome. */}
        <Route
          path="/assessments/:assessmentId/run"
          element={<CandidateRoute>{page(AssessmentRunner)}</CandidateRoute>}
        />
      </Routes>
    </div>
  );
}
