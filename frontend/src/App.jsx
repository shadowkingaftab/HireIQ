import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from "react";
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import ProtectedRoute from './routes/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import PublicLayout from './layouts/PublicLayout';

import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import Capabilities from './pages/Capabilities';
import EvidenceExplorer from './pages/EvidenceExplorer';
import Assessments from './pages/Assessments';
import AssessmentRunner from './pages/AssessmentRunner';
import AssessmentResults from './pages/AssessmentResults';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Applications from './pages/Applications';
import Activity from './pages/Activity';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';

import CandidateSearch from './pages/CandidateSearch';
import CandidateDirectory from './pages/CandidateDirectory';
import CandidateComparison from './pages/CandidateComparison';
import Jobs from './pages/Jobs';
import JobBuilder from './pages/JobBuilder';
import JobDetails from './pages/JobDetails';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';

import AdminDashboard from './pages/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated shell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Candidate surfaces */}
          <Route path="/profile" element={<CandidateProfile />} />
          <Route path="/capabilities" element={<Capabilities />} />
          <Route path="/evidence" element={<EvidenceExplorer />} />
          <Route path="/assessments" element={<Assessments />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:jobId" element={<MatchDetail />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/activity" element={<Activity />} />

          {/* Recruiter surfaces */}
          <Route path="/candidates" element={<CandidateDirectory />} />
          <Route path="/candidates/search" element={<CandidateSearch />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfile recruiterView />} />
          <Route path="/candidates/:candidateId/match/:jobId" element={<CandidateProfile recruiterView focus="match" />} />
          <Route path="/compare" element={<CandidateComparison />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<JobBuilder />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reports" element={<Reports />} />

          {/* Shared surfaces */}
          <Route path="/assessments/:assessmentId/results" element={<AssessmentResults />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Immersive assessment runner — outside the shell chrome. */}
        <Route
          path="/assessments/:assessmentId/run"
          element={
            <ProtectedRoute>
              <AssessmentRunner />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
