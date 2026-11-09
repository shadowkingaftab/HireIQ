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
  GitBranch,
  Activity as ActivityIcon,
} from "lucide-react";

/**
 * Single source of truth for application navigation.
 * Consumed by the Sidebar, mobile nav drawer and CommandPalette so all three
 * always agree. `roles` gates visibility by authStore role.
 */
export const candidateNav = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Profile", to: "/profile", icon: UserRound },
  { label: "Capabilities", to: "/capabilities", icon: GitBranch },
  { label: "Evidence", to: "/evidence", icon: ShieldCheck },
  { label: "Assessments", to: "/assessments", icon: ClipboardList },
  { label: "Matches", to: "/matches", icon: Target },
  { label: "Applications", to: "/applications", icon: Send },
  { label: "Activity", to: "/activity", icon: ActivityIcon },
];

export const recruiterNav = [
  { label: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { label: "Candidate Search", to: "/candidates/search", icon: Search },
  { label: "Candidates", to: "/candidates", icon: Users },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
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
  if (role === "recruiter") return recruiterNav;
  if (role === "admin") return [...recruiterNav.slice(0, 1), ...sharedNav];
  return [];
}

/** Friendly breadcrumb labels — never expose raw technical segments. */
export const routeLabels = {
  dashboard: "Overview",
  profile: "Profile",
  capabilities: "Capabilities",
  evidence: "Evidence",
  assessments: "Assessments",
  run: "Runner",
  results: "Results",
  matches: "Matches",
  applications: "Applications",
  activity: "Activity",
  candidates: "Candidates",
  search: "Search",
  compare: "Compare",
  jobs: "Jobs",
  new: "New",
  analytics: "Analytics",
  reports: "Reports",
  notifications: "Notifications",
  integrations: "Integrations",
  settings: "Settings",
  admin: "Admin",
};
