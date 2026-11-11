import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar, { SidebarContent } from "./Sidebar";
import TopBar from "../TopBar";
import CommandPalette from "../CommandPalette";
import AccountMenu from "./AccountMenu";
import Drawer from "../ui/Drawer";
import Container from "../ui/Container";
import { useAuthStore } from "../../store/authStore";
import { brand } from "../../utils/brand";

const COLLAPSE_KEY = "ph.sidebar.collapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * ProofHire application shell.
 * Desktop (lg+): persistent sidebar with user collapse control.
 * Tablet (md–lg): icon navigation rail.
 * Mobile (<md): top bar + navigation drawer.
 */
export default function AppShell() {
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [navOpen, setNavOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const location = useLocation();
  const role = useAuthStore((s) => s.user?.role);

  // Tablet default: start collapsed below lg. Runs once on mount.
  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches || readCollapsed()) return;
    setCollapsed(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((v) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, v ? "0" : "1");
      } catch {
        // ignore
      }
      return !v;
    });
  }, []);

  // Close the mobile drawer on navigation
  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  // Global command palette shortcut
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="flex min-h-dvh bg-transparent">
      <Sidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenNav={() => setNavOpen(true)} onOpenPalette={() => setPaletteOpen(true)} />

        <main className="flex-1">
          <Container className="py-8">
            <Outlet />
          </Container>
        </main>

        <footer className="border-t border-line-subtle">
          <Container className="flex h-12 items-center justify-between">
            <p className="text-micro text-ink-faint">{brand.name} — verified capability, not claims.</p>
            {role && (
              <p className="text-micro capitalize text-ink-faint">{role} workspace</p>
            )}
          </Container>
        </footer>
      </div>

      {/* Mobile / tablet navigation drawer */}
      <Drawer open={navOpen} onClose={() => setNavOpen(false)} position="left" width="sm" title={brand.name}>
        <div className="-mx-5 -my-4">
          <div className="h-[calc(100dvh-16rem)] overflow-y-auto px-3 pb-2 pt-3">
            <SidebarContent showBrand={false} />
          </div>
          <div className="px-3 py-3">
            <p className="mb-1.5 px-3 text-micro font-medium uppercase tracking-caps text-ink-faint">Account</p>
            <AccountMenu />
          </div>
        </div>
      </Drawer>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
