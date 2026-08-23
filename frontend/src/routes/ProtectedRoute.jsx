import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

/**
 * Base auth guard. Usable as a wrapper ({children}) or as a layout route
 * (no children -> renders <Outlet />, enabling nested shell layouts).
 * - No token -> login.
 * - `roles` provided and user is loaded without a matching role -> home.
 * - Token present but user not yet resolved -> render content (session is
 *   hydrating; role checks defer rather than flash a redirect).
 */
export default function ProtectedRoute({ children, roles }) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  const content = children ?? <Outlet />;

  if (!token) return <Navigate to="/login" replace />;

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return content;
}
