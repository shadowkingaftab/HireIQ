import { useLayoutEffect, useRef, useState } from "react";

function useIndicator(value, listRef) {
  const [style, setStyle] = useState(null);
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector(`[data-tab-value="${CSS.escape(String(value))}"]`);
    if (!active) return;
    setStyle({ left: active.offsetLeft, width: active.offsetWidth });
  }, [value, listRef]);
  return style;
}

/**
 * Accessible tabs: roving tabindex, Arrow/Home/End keys, ARIA wiring, and a
 * subtle measured indicator that slides between tabs.
 *
 * Controlled: pass `value` + `onChange`. Uncontrolled: pass `defaultValue`.
 * `items`: [{ value, label, icon, disabled }]
 */
export default function Tabs({ items = [], value, defaultValue, onChange, className = "" }) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value);
  const active = isControlled ? value : internal;
  const listRef = useRef(null);
  const indicator = useIndicator(active, listRef);

  const select = (v, disabled) => {
    if (disabled) return;
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };

  const onKeyDown = (e) => {
    const enabled = items.filter((t) => !t.disabled);
    const idx = enabled.findIndex((t) => t.value === active);
    let next = null;
    if (e.key === "ArrowRight") next = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (next) {
      e.preventDefault();
      select(next.value);
      listRef.current?.querySelector(`[data-tab-value="${CSS.escape(String(next.value))}"]`)?.focus();
    }
  };

  return (
    <div className={className}>
      <div
        ref={listRef}
        role="tablist"
        onKeyDown={onKeyDown}
        className="relative inline-flex items-center gap-1 rounded-lg border border-line-subtle bg-surface-2/60 p-1"
      >
        {indicator && (
          <span
            aria-hidden="true"
            className="absolute bottom-1 top-1 rounded-md border border-line-subtle bg-surface-1 shadow-card transition-[left,width] duration-200 ease-out"
            style={{ left: indicator.left, width: indicator.width }}
          />
        )}
        {items.map(({ value: v, label, icon: Icon, disabled }) => {
          const isActive = v === active;
          return (
            <button
              key={v}
              type="button"
              role="tab"
              data-tab-value={v}
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              disabled={disabled}
              onClick={() => select(v, disabled)}
              className={`relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-body-sm font-medium transition-colors duration-150 focus-visible:outline-none ${
                disabled
                  ? "cursor-not-allowed text-ink-faint"
                  : isActive
                    ? "text-ink-hi"
                    : "text-ink-muted hover:text-ink-hi"
              }`}
            >
              {Icon && <Icon size={14} aria-hidden="true" />}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Panel companion — renders only when active. */
export function TabPanel({ value, active, children, className = "", ...props }) {
  if (value !== active) return null;
  return (
    <div
      role="tabpanel"
      className={`animate-fade-in ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
