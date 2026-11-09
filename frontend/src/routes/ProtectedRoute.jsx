import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Base auth guard. Usable as a wrapper ({children}) or as a layout route
 * (no children -> renders <Outlet />, enabling nested shell layouts).
 * - No token -> login.
 * - `roles` provided without a loaded user -> sign in again to resolve the role.
 * - `roles` provided and user has a different role -> public home.
 */
export default function ProtectedRoute({ children, roles }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const content = children ?? <Outlet />;

  if (!token) return <Navigate to="/login" replace />;

  if (roles && !user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return content;
}
