import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { primaryNavFor, sharedNav } from "./navConfig";
import Tooltip from "../ui/Tooltip";
import { brand } from "../../utils/brand";

function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-intel/30 bg-intel-soft font-mono text-[11px] font-bold tracking-tight text-intel"
      >
        {brand.shortMark}
      </span>
      {!compact && (
        <span className="truncate text-body-sm font-semibold tracking-tight text-ink-hi">
          {brand.name}
        </span>
      )}
    </div>
  );
}

function NavLinkList({ items, collapsed = false }) {
  return (
    <nav className="flex flex-col gap-0.5" aria-label="Primary">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} title={collapsed ? label : undefined}>
          {({ isActive }) => (
            <span
              className={`relative flex h-9 items-center rounded-md text-body-sm transition-colors duration-150 ease-out focus-visible:outline-none ${
                collapsed ? "justify-center px-0" : "gap-2.5 px-3"
              } ${
                isActive
                  ? "bg-surface-2 font-medium text-ink-hi"
                  : "text-ink-muted hover:bg-surface-2/60 hover:text-ink-hi"
              }`}
            >
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-intel"
                />
              )}
              <Icon size={16} className="shrink-0" aria-hidden="true" />
              {!collapsed && <span className="truncate">{label}</span>}
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

/**
 * Desktop sidebar content. `collapsed` renders the icon-rail variant used on
 * tablet widths and when the user collapses it.
 */
export function SidebarContent({ collapsed = false, showBrand = true }) {
  const user = useAuthStore((s) => s.user);
  const primary = primaryNavFor(user?.role);

  return (
    <div className="flex h-full flex-col">
      {showBrand && (
        <div className={`flex h-14 shrink-0 items-center border-b border-line-subtle ${collapsed ? "justify-center px-2" : "px-4"}`}>
          <BrandMark compact={collapsed} />
        </div>
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-4">
        <NavLinkList items={primary} collapsed={collapsed} />
        <div>
          {!collapsed && (
            <p className="mb-1.5 px-3 text-micro font-medium uppercase tracking-caps text-ink-faint">
              Workspace
            </p>
          )}
          <NavLinkList items={sharedNav} collapsed={collapsed} />
        </div>
      </div>

      {!collapsed && (
        <p className="shrink-0 px-5 pb-3 text-micro text-ink-faint">
          {brand.tagline}
        </p>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed = false, onToggleCollapse }) {
  return (
    <aside
      className={`sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line-subtle bg-surface-1 transition-[width] duration-200 ease-out md:flex ${
        collapsed ? "w-[68px]" : "w-60"
      }`}
    >
      <SidebarContent collapsed={collapsed} />

      <div className="border-t border-line-subtle p-2">
        <Tooltip content={collapsed ? "Expand navigation" : "Collapse navigation"} placement="right" className="w-full">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            className="flex h-9 w-full items-center justify-center rounded-md text-ink-faint transition-colors hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none"
          >
            {collapsed ? (
              <PanelLeftOpen size={16} aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose size={16} aria-hidden="true" />
                {!collapsed && <span className="sr-only">Collapse navigation</span>}
              </>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
