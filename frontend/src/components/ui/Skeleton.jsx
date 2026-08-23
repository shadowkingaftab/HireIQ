/**
 * Loading primitives. Shimmer sweep comes from `.ph-skeleton` in
 * animations.css; the base block uses the surface layer so it reads as a
 * quiet placeholder in both themes.
 */

function Base({ className = "", ...props }) {
  return (
    <div
      aria-hidden="true"
      className={`ph-skeleton rounded-md bg-surface-3 ${className}`}
      {...props}
    />
  );
}

/** Generic box. */
export function Skeleton({ className = "", ...props }) {
  return <Base className={className} {...props} />;
}

/** Text line(s). Pass `lines` for paragraphs. */
export function SkeletonText({ lines = 1, className = "" }) {
  if (lines === 1) {
    return <Base className={`h-3.5 w-full ${className}`} />;
  }
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <Base key={i} className={`h-3.5 ${i === lines - 1 ? "w-2/3" : "w-full"}`} />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40, className = "" }) {
  return <Base className={`rounded-full ${className}`} style={{ width: size, height: size }} />;
}

export function SkeletonCard({ lines = 3, className = "" }) {
  return (
    <div className={`rounded-card border border-line-subtle bg-surface-1 p-5 shadow-card ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonAvatar size={36} />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3.5 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
      <div className="mt-4">
        <SkeletonText lines={lines} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = "" }) {
  return (
    <div
      role="status"
      aria-label="Loading data"
      className={`overflow-hidden rounded-card border border-line-subtle bg-surface-1 ${className}`}
    >
      <div className="flex gap-4 border-b border-line-subtle px-4 py-3">
        {Array.from({ length: columns }, (_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-line-subtle px-4 py-3.5 last:border-b-0">
          {Array.from({ length: columns }, (_, c) => (
            <Skeleton key={c} className={`h-3.5 flex-1 ${c === columns - 1 ? "max-w-[80px]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
