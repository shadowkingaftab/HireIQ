import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { routeLabels } from "./layout/navConfig";

function labelFor(segment, index, segments) {
  // IDs (numeric or uuid-like) render as-is; known routes use the label map.
  if (/^(\d+|[0-9a-f]{8}-[0-9a-f]{4})/i.test(segment)) return segment.slice(0, 8);
  const prev = segments[index - 1];
  // "candidates/new" reads better as "New candidate" context; keep simple map.
  void prev;
  return (
    routeLabels[segment] ||
    segment.replace(/[-_]/g, " ").replace(/^\w/, (c) => c.toUpperCase())
  );
}

/**
 * Breadcrumbs derived from the current location. The root overview segment is
 * omitted (it is one click away in the brand/nav), and hidden on small
 * screens to keep the mobile top bar quiet.
 */
export default function Breadcrumbs({ className = "" }) {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length <= 1 || segments[0] === "dashboard") {
    return <span aria-hidden="true" className={`hidden lg:block ${className}`} />;
  }

  const crumbs = segments.map((seg, i) => ({
    to: "/" + segments.slice(0, i + 1).join("/"),
    label: labelFor(seg, i, segments),
    isLast: i === segments.length - 1,
  }));

  return (
    <nav aria-label="Breadcrumb" className={`hidden min-w-0 lg:block ${className}`}>
      <ol className="flex min-w-0 items-center gap-1 text-body-sm text-ink-muted">
        {crumbs.map(({ to, label, isLast }, i) => (
          <li key={to} className="flex min-w-0 items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="shrink-0 text-ink-faint" aria-hidden="true" />}
            {isLast ? (
              <span className="truncate font-medium text-ink-hi" aria-current="page">
                {label}
              </span>
            ) : (
              <Link
                to={to}
                className="truncate rounded transition-colors hover:text-ink-hi focus-visible:outline-none"
              >
                {label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
