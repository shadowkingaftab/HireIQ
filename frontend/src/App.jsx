import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FeedbackPrompt from "./components/FeedbackPrompt";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider } from './context/AuthContext';

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Pricing = lazy(() => import("./pages/Pricing"));
const RecruiterDashboard = lazy(() => import("./pages/RecruiterDashboard"));
const RecruiterAnalytics = lazy(() => import("./pages/RecruiterAnalytics"));
const RecruiterPreferences = lazy(() => import("./pages/RecruiterPreferences"));
const TeamDashboard = lazy(() => import("./pages/TeamDashboard"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/analytics" element={<RecruiterAnalytics />} />
              <Route path="/recruiter/preferences" element={<RecruiterPreferences />} />
            <Route path="/teams" element={<TeamDashboard />} />
            <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
        </div>
        </Router>
        <FeedbackPrompt />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
