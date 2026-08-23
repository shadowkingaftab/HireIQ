import ProtectedRoute from "./ProtectedRoute";

export default function RecruiterRoute({ children }) {
  return <ProtectedRoute roles={["recruiter", "admin"]}>{children}</ProtectedRoute>;
}
