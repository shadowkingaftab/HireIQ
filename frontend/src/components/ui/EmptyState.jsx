/**
 * Empty state for lists, searches and dashboards. Restrained by design:
 * quiet icon well, clear title, one primary action.
 */
export default function EmptyState({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
  className = "",
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line-subtle bg-surface-1/50 px-6 py-14 text-center ${className}`}
      {...props}
    >
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line-subtle bg-surface-2 text-ink-faint">
          <Icon size={20} aria-hidden="true" />
        </div>
      )}
      <div className="max-w-sm">
        <h3 className="text-section-sm text-ink-hi">{title}</h3>
        {description && (
          <p className="mt-1 text-body-sm text-ink-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
