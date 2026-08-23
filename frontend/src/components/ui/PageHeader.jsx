/**
 * Standard page heading block: eyebrow (optional), title on the page type
 * scale, description, and right-aligned actions.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = "",
  ...props
}) {
  return (
    <header
      className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${className}`}
      {...props}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1.5 text-micro font-medium uppercase tracking-caps text-intel">
            {eyebrow}
          </p>
        )}
        <h1 className="text-page text-ink-hi">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-body-sm leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-2.5">{actions}</div>
      )}
    </header>
  );
}
