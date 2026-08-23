import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Users,
  Briefcase,
  ClipboardList,
  Target,
  BarChart3,
  Settings,
  Bell,
  Plug,
  FilePlus2,
  CornerDownLeft,
} from "lucide-react";
import Dialog from "./ui/Dialog";
import Input from "./ui/Input";
import { primaryNavFor, sharedNav } from "./layout/navConfig";
import { useAuthStore } from "../store/authStore";

const NAV_ICONS = {
  "/dashboard": LayoutDashboard,
  "/profile": Users,
  "/evidence": ClipboardList,
  "/assessments": ClipboardList,
  "/matches": Target,
  "/applications": ClipboardList,
  "/candidates/search": Search,
  "/candidates": Users,
  "/jobs": Briefcase,
  "/analytics": BarChart3,
  "/reports": BarChart3,
  "/notifications": Bell,
  "/integrations": Plug,
  "/settings": Settings,
};

function buildCommands(role) {
  const navigate = (to) => ({ type: "navigate", to });
  const pages = [...primaryNavFor(role), ...sharedNav].map(({ label, to, icon }) => ({
    group: "Navigate",
    label,
    icon: icon || NAV_ICONS[to] || LayoutDashboard,
    ...navigate(to),
  }));
  return [
    ...pages,
    { group: "Actions", label: "Create job", icon: FilePlus2, ...navigate("/jobs/new") },
    { group: "Actions", label: "Search candidates", icon: Search, ...navigate("/candidates/search") },
    { group: "Actions", label: "View notifications", icon: Bell, ...navigate("/notifications") },
  ];
}

/**
 * Application command palette — Ctrl/Cmd + K.
 * Navigation commands only; no simulated backend operations.
 */
export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const commands = useMemo(() => buildCommands(user?.role), [user?.role]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.label.toLowerCase().includes(q));
  }, [commands, query]);

  const groups = useMemo(() => {
    const map = new Map();
    filtered.forEach((c) => {
      if (!map.has(c.group)) map.set(c.group, []);
      map.get(c.group).push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setIndex(0);
  }, [query]);

  const runCommand = (command) => {
    onClose();
    if (command.type === "navigate") navigate(command.to);
    command.action?.();
  };

  const onKeyDown = (e) => {
    if (!filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[index]);
    }
  };

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-cmd-index="${index}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [index]);

  let flatIndex = -1;

  return (
    <Dialog open={open} onClose={onClose} size="md">
      <div onKeyDown={onKeyDown}>
        <Input
          data-autofocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or search…"
          aria-label="Search commands"
        />

        <div ref={listRef} className="mt-3 max-h-80 overflow-y-auto" role="listbox" aria-label="Commands">
          {groups.length === 0 ? (
            <div className="px-3 py-10 text-center">
              <p className="text-body-sm font-medium text-ink-hi">No matching commands</p>
              <p className="mt-1 text-meta font-sans text-ink-muted">
                Try “jobs”, “search”, or “settings”.
              </p>
            </div>
          ) : (
            groups.map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 pb-1 pt-2 text-micro font-medium uppercase tracking-caps text-ink-faint">
                  {group}
                </p>
                {items.map((command) => {
                  flatIndex += 1;
                  const current = flatIndex;
                  const selected = current === index;
                  return (
                    <button
                      key={`${group}-${command.label}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      data-cmd-index={current}
                      onMouseMove={() => setIndex(current)}
                      onClick={() => runCommand(command)}
                      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-body-sm transition-colors duration-100 focus-visible:outline-none ${
                        selected ? "bg-surface-2 text-ink-hi" : "text-ink-muted"
                      }`}
                    >
                      <command.icon size={15} className="shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate text-left">{command.label}</span>
                      {selected && (
                        <CornerDownLeft size={13} className="shrink-0 text-ink-faint" aria-hidden="true" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="mt-2 flex items-center justify-end gap-4 border-t border-line-subtle pt-3">
          <kbd className="text-micro text-ink-faint">↑↓ navigate</kbd>
          <kbd className="text-micro text-ink-faint">↵ select</kbd>
          <kbd className="text-micro text-ink-faint">esc close</kbd>
        </div>
      </div>
    </Dialog>
  );
}
