import ProtectedRoute from "./ProtectedRoute";

export default function CandidateRoute({ children }) {
  return <ProtectedRoute roles={["candidate"]}>{children}</ProtectedRoute>;
}
