import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Pricing from "./pages/Pricing";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterAnalytics from "./pages/RecruiterAnalytics";
import RecruiterPreferences from "./pages/RecruiterPreferences";
import TeamDashboard from "./pages/TeamDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import PublicCandidateProfile from "./pages/PublicCandidateProfile";
import CandidateSearch from "./pages/CandidateSearch";
import CandidateComparison from "./pages/CandidateComparison";
import EvidenceExplorer from "./pages/EvidenceExplorer";
import SkillGraphExplorer from "./pages/SkillGraphExplorer";
import RepositoryInsights from "./pages/RepositoryInsights";
import JobDetails from "./pages/JobDetails";
import JobBuilder from "./pages/JobBuilder";
import Applications from "./pages/Applications";
import AssessmentBuilder from "./pages/AssessmentBuilder";
import AssessmentResults from "./pages/AssessmentResults";
import InterviewWorkspace from "./pages/InterviewWorkspace";
import OrganizationSettings from "./pages/OrganizationSettings";
import IntegrationSettings from "./pages/IntegrationSettings";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Billing from "./pages/Billing";
import AdminDashboard from "./pages/AdminDashboard";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    document.title = "ProofHire";
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
        <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
        <Route path="/recruiter/preferences" element={<RecruiterPreferences />} />
        <Route path="/team" element={<TeamDashboard />} />
        <Route path="/candidates/:id" element={<CandidateProfile />} />
        <Route path="/candidates/public/:id" element={<PublicCandidateProfile />} />
        <Route path="/search/candidates" element={<CandidateSearch />} />
        <Route path="/candidates/compare" element={<CandidateComparison />} />
        <Route path="/evidence/:candidateId" element={<EvidenceExplorer />} />
        <Route path="/skills" element={<SkillGraphExplorer />} />
        <Route path="/repositories/:candidateId" element={<RepositoryInsights />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/jobs/create" element={<JobBuilder />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/assessments/create" element={<AssessmentBuilder />} />
        <Route path="/assessments/:id/results" element={<AssessmentResults />} />
        <Route path="/interviews" element={<InterviewWorkspace />} />
        <Route path="/settings/organization" element={<OrganizationSettings />} />
        <Route path="/settings/integrations" element={<IntegrationSettings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
