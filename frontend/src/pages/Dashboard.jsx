import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import CandidateDashboard from "./dashboards/CandidateDashboard";
import RecruiterDashboard from "./dashboards/RecruiterDashboard";
import AdminDashboard from "./AdminDashboard";

/** Role-aware entry point — each role gets its own command center. */
export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  if (!["candidate", "recruiter", "admin"].includes(role)) {
    return <Navigate to="/login" replace />;
  }
  if (role === "recruiter") return <RecruiterDashboard />;
  if (role === "admin") return <AdminDashboard />;
  return <CandidateDashboard />;
}
