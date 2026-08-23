import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { can } from "../lib/permissions";

/**
 * Unified auth hook — the only API components should use for session state.
 * Delegates to authStore (single source of truth) and adds role helpers on
 * top of the existing permission matrix in lib/permissions.js.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const setToken = useAuthStore((s) => s.setToken);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);
  const role = user?.role ?? null;

  const hasRole = useMemo(
    () => (...roles) => role !== null && roles.includes(role),
    [role]
  );

  const check = useMemo(() => (action) => can(role, action), [role]);

  return { user, token, setUser, setToken, logout, isAuthenticated, role, hasRole, can: check };
}
