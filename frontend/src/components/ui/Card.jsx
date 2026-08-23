import { forwardRef } from "react";

const variants = {
  default: "",
  elevated: "shadow-raised border-line-subtle/80",
  glass: "panel-glass shadow-card",
  interactive:
    "cursor-pointer transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-line-strong hover:shadow-raised hover:-translate-y-0.5",
};

/**
 * ProofHire card surface + composed subcomponents.
 * Variant "interactive" adds restrained lift on hover — no glow.
 */
const Card = forwardRef(function Card(
  { variant = "default", as: Tag = "div", className = "", children, ...props },
  ref
) {
  return (
    <Tag
      ref={ref}
      className={`rounded-card border border-line-subtle bg-surface-1 shadow-card ${
        variants[variant] || ""
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
});

export function CardHeader({ className = "", children, ...props }) {
  return (
    <div
      className={`flex flex-col gap-1 border-b border-line-subtle px-5 py-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children, ...props }) {
  return (
    <h3 className={`text-section-sm text-ink-hi ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className = "", children, ...props }) {
  return (
    <p className={`text-body-sm text-ink-muted ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`px-5 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className = "", children, ...props }) {
  return (
    <div
      className={`flex items-center gap-3 border-t border-line-subtle px-5 py-3.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
