/**
 * Hairline divider with optional centered label. Borders come from the
 * line token — never raw colors.
 */
export default function Divider({ label, className = "" }) {
  if (!label) {
    return <hr className={`border-line-subtle ${className}`} />;
  }
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
      <span className="text-micro uppercase tracking-caps text-ink-muted">{label}</span>
      <span className="h-px flex-1 bg-line-strong" aria-hidden="true" />
    </div>
  );
}
