import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "../TopBar";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/search/candidates", label: "Candidates" },
  { href: "/jobs", label: "Jobs" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings/organization", label: "Settings" },
];

export default function AppShell() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar items={sidebarItems} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TopBar />
        <main style={{ padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
