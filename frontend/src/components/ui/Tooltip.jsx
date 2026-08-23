/**
 * Restrained tooltip for dense intelligence surfaces. Pure CSS show/hide
 * (hover + keyboard focus), no JS positioning — anchored above or below the
 * trigger with a short reveal delay.
 *
 * Wrap any trigger element: <Tooltip content="..."><button/></Tooltip>
 */
export default function Tooltip({ content, placement = "top", className = "", children }) {
  if (!content) return children;

  const position =
    placement === "bottom"
      ? "top-full left-1/2 mt-2 -translate-x-1/2"
      : "bottom-full left-1/2 mb-2 -translate-x-1/2";

  return (
    <span className={`group/tt relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-tooltip w-max max-w-56 rounded-md border border-line-strong bg-surface-inverse px-2.5 py-1.5 text-micro font-medium leading-snug text-ink-inverse opacity-0 shadow-raised transition-opacity duration-150 ease-out group-hover/tt:[transition-delay:250ms] group-focus-within/tt:[transition-delay:250ms] group-hover/tt:opacity-100 group-focus-within/tt:opacity-100 ${position}`}
      >
        <span
          aria-hidden="true"
          className={`absolute h-1.5 w-1.5 rotate-45 border border-line-strong bg-surface-inverse ${
            placement === "bottom"
              ? "-top-[3px] left-1/2 -translate-x-1/2"
              : "-bottom-[3px] left-1/2 -translate-x-1/2"
          }`}
        />
        {content}
      </span>
    </span>
  );
}
