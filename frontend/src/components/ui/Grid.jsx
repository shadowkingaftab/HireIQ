const gaps = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const colClass = (n) =>
  ({
    1: "grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
    12: "grid-cols-12",
  })[n] || "grid-cols-1";

/** Responsive grid with sane mobile collapse; `cols` accepts 1|2|3|4|12. */
export default function Grid({ cols = 3, gap = "md", className = "", children, ...props }) {
  return (
    <div
      className={`grid ${colClass(cols)} ${gaps[gap] || gaps.md} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
