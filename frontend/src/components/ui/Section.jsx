import Container from "./Container";

/**
 * Page section band: vertical rhythm + optional heading row with actions.
 * Used as the repeating structural unit inside dashboards and detail pages.
 */
export default function Section({
  title,
  description,
  actions,
  spacing = "lg",
  container = true,
  className = "",
  children,
  ...props
}) {
  const body = (
    <>
      {(title || actions) && (
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {title && <h2 className="text-section text-ink-hi">{title}</h2>}
            {description && (
              <p className="mt-0.5 max-w-2xl text-body-sm text-ink-muted">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2.5">{actions}</div>}
        </div>
      )}
      {children}
    </>
  );

  return (
    <section className={`${spacing === "lg" ? "py-8" : "py-4"} ${className}`} {...props}>
      {container ? <Container>{body}</Container> : body}
    </section>
  );
}
