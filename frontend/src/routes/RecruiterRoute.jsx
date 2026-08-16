import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function RecruiterRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  if (user?.role !== "recruiter") return <Navigate to="/" replace />;
  return children;
}
