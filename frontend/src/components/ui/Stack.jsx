const gaps = {
  none: "gap-0",
  xs: "gap-1.5",
  sm: "gap-2.5",
  md: "gap-4",
  lg: "gap-6",
  xl: "gap-8",
};

const aligns = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const justifies = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

/** Flex stack — the workhorse for vertical rhythm between blocks. */
export default function Stack({
  direction = "col",
  gap = "md",
  align,
  justify,
  wrap = false,
  as: Tag = "div",
  className = "",
  children,
  ...props
}) {
  return (
    <Tag
      className={`flex ${
        direction === "row" ? "flex-row" : "flex-col"
      } ${gaps[gap] || gaps.md} ${align ? aligns[align] : ""} ${
        justify ? justifies[justify] : ""
      } ${wrap ? "flex-wrap" : ""} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
