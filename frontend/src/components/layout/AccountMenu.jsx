import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserRound, Settings, Bell, LogOut, ChevronDown } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

function initialsOf(user) {
  const source = user?.name || user?.email || "";
  const parts = source.split(/[\s@._]+/).filter(Boolean);
  return (parts[0]?.[0] || "P").concat(parts[1]?.[0] || "").toUpperCase();
}

/**
 * Account area for the sidebar bottom and top bar.
 * Reads the single authStore session state; sign out uses the existing
 * frontend mechanism (store clears token/user, API helper stops sending it).
 */
export default function AccountMenu({ compact = false, direction = "up" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const name = user?.name || user?.email?.split("@")[0] || "Signed in";
  const role = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : null;

  const go = (path) => {
    setOpen(false);
    navigate(path);
  };

  const signOut = () => {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  const items = [
    { label: "Profile", icon: UserRound, action: () => go("/profile") },
    { label: "Settings", icon: Settings, action: () => go("/settings") },
    { label: "Notifications", icon: Bell, action: () => go("/notifications") },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={`flex h-9 items-center rounded-md transition-colors duration-150 focus-visible:outline-none ${
          compact
            ? "justify-center px-0"
            : "w-full gap-2.5 px-2 hover:bg-surface-2"
        } ${open ? "bg-surface-2" : ""}`}
      >
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-subtle bg-surface-3 font-mono text-[11px] font-semibold text-ink-med">
          {initialsOf(user)}
        </span>
        {!compact && (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-body-sm font-medium leading-tight text-ink-hi">
                {name}
              </span>
              {role && (
                <span className="block truncate text-micro leading-tight text-ink-faint">
                  {role}
                </span>
              )}
            </span>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className={`shrink-0 text-ink-faint transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className={`panel-raised absolute z-overlay w-56 overflow-hidden rounded-lg animate-scale-in ${
            direction === "up" ? "bottom-full mb-2" : "top-full mt-2"
          } ${compact ? "right-0" : "left-0"}`}
        >
          <div className="border-b border-line-subtle px-3.5 py-2.5">
            <p className="truncate text-body-sm font-medium text-ink-hi">{name}</p>
            {user?.email && (
              <p className="truncate text-micro text-ink-faint">{user.email}</p>
            )}
          </div>
          <div className="p-1.5">
            {items.map(({ label, icon: Icon, action }) => (
              <button
                key={label}
                type="button"
                role="menuitem"
                onClick={action}
                className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm text-ink-med transition-colors hover:bg-surface-2 hover:text-ink-hi focus-visible:outline-none"
              >
                <Icon size={15} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <div className="border-t border-line-subtle p-1.5">
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-body-sm text-danger transition-colors hover:bg-danger-soft focus-visible:outline-none"
            >
              <LogOut size={15} aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
