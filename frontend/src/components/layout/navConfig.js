import {
  LayoutDashboard,
  UserRound,
  ShieldCheck,
  ClipboardList,
  Target,
  Send,
  Search,
  Users,
  Briefcase,
  BarChart3,
  FileBarChart,
  Bell,
  Plug,
  Settings,
} from "lucide-react";

/**
 * Single source of truth for application navigation.
 * Consumed by the Sidebar, mobile nav drawer and CommandPalette so all three
 * always agree. `roles` gates visibility once role state exists; items are
 * visible to every authenticated user when `roles` is omitted.
 *
 * NOTE: routes for areas not yet implemented resolve to the shell's
 * structured NotFound screen — this prepares navigation honestly without
 * pretending features exist.
 */
export const candidateNav = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/profile", icon: UserRound },
  { label: "Evidence", to: "/evidence", icon: ShieldCheck },
  { label: "Assessments", to: "/assessments", icon: ClipboardList },
  { label: "Matches", to: "/matches", icon: Target },
  { label: "Applications", to: "/applications", icon: Send },
];

export const recruiterNav = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Candidate Search", to: "/candidates/search", icon: Search },
  { label: "Candidates", to: "/candidates", icon: Users },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "Assessments", to: "/assessments", icon: ClipboardList },
  { label: "Matches", to: "/matches", icon: Target },
  { label: "Analytics", to: "/analytics", icon: BarChart3 },
  { label: "Reports", to: "/reports", icon: FileBarChart },
];

export const sharedNav = [
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Integrations", to: "/integrations", icon: Plug },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function primaryNavFor(role) {
  if (role === "candidate") return candidateNav;
  // Recruiter + admin + unknown-role fallback see the full product surface.
  return recruiterNav;
}

/** Friendly breadcrumb labels — never expose raw technical segments. */
export const routeLabels = {
  dashboard: "Overview",
  profile: "Profile",
  evidence: "Evidence",
  assessments: "Assessments",
  matches: "Matches",
  applications: "Applications",
  candidates: "Candidates",
  search: "Search",
  jobs: "Jobs",
  new: "New",
  analytics: "Analytics",
  reports: "Reports",
  notifications: "Notifications",
  integrations: "Integrations",
  settings: "Settings",
  admin: "Admin",
};
