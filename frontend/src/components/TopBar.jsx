import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import Breadcrumbs from "./Breadcrumbs";
import AccountMenu from "./layout/AccountMenu";
import NotificationsPanel from "./layout/NotificationsPanel";
import Tooltip from "./ui/Tooltip";
import { useNotificationStore } from "../store/notificationStore";

function IconButton({ label, onClick, children, showDot = false }) {
  return (
    <Tooltip content={label}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="relative flex h-9 w-9 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none"
      >
        {children}
        {showDot && (
          <span
            aria-hidden="true"
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-intel ring-2 ring-canvas"
          />
        )}
      </button>
    </Tooltip>
  );
}

/**
 * Quiet application top bar: navigation trigger on small screens, breadcrumb
 * context, command palette entry point, notifications and account.
 */
export default function TopBar({ onOpenNav, onOpenPalette }) {
  const unread = useNotificationStore((s) => s.unreadCount);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="panel-glass sticky top-0 z-sticky flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:px-4">
      <div className="md:hidden">
        <IconButton label="Open navigation" onClick={onOpenNav}>
          <Menu size={17} aria-hidden="true" />
        </IconButton>
      </div>

      <div className="min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <button
        type="button"
        onClick={onOpenPalette}
        aria-label="Open command palette"
        className="hidden h-9 items-center gap-2.5 rounded-md border border-line-subtle bg-surface-2/60 px-3 text-body-sm text-ink-faint transition-colors hover:border-line-strong hover:text-ink-med focus-visible:outline-none sm:flex"
      >
        <Search size={14} aria-hidden="true" />
        <span className="hidden md:inline">Search or jump to…</span>
        <kbd className="rounded border border-line-subtle bg-surface-1 px-1.5 py-0.5 font-mono text-micro text-ink-faint">
          ⌘K
        </kbd>
      </button>
      <div className="sm:hidden">
        <IconButton label="Search or jump to…" onClick={onOpenPalette}>
          <Search size={16} aria-hidden="true" />
        </IconButton>
      </div>

      <IconButton
        label="Notifications"
        onClick={() => setNotificationsOpen(true)}
        showDot={unread > 0}
      >
        <Bell size={16} aria-hidden="true" />
      </IconButton>

      <div className="ml-1 w-9">
        <AccountMenu compact direction="down" />
      </div>

      <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </header>
  );
}
