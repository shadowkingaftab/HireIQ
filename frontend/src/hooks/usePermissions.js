import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = useMemo(() => user?.role === "admin", [user]);
  const isRecruiter = useMemo(() => user?.role === "recruiter", [user]);
  const isCandidate = useMemo(() => user?.role === "candidate", [user]);
  return { isAdmin, isRecruiter, isCandidate };
}
