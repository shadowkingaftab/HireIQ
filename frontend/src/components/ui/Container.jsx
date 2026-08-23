/**
 * Page-width container with responsive gutters. The single place that owns
 * horizontal page rhythm.
 */
export default function Container({ size = "lg", className = "", children, ...props }) {
  const widths = {
    sm: "max-w-3xl",
    md: "max-w-5xl",
    lg: "max-w-7xl",
    full: "max-w-none",
  };
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widths[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}
