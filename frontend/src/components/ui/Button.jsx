import { cloneElement, forwardRef, isValidElement } from "react";
import { Link } from "react-router-dom";

const variants = {
  primary: "orion-orange-cta text-white disabled:hover:opacity-50",
  secondary:
    "bg-surface-2 text-ink-hi border border-line-subtle hover:bg-surface-3 hover:border-line-strong active:bg-surface-3/80",
  ghost: "bg-transparent text-ink-med hover:bg-surface-2 hover:text-ink-hi active:bg-surface-3",
  outline:
    "bg-transparent text-ink-hi border border-line-strong hover:bg-surface-2 active:bg-surface-3",
  destructive: "bg-danger text-white hover:bg-danger/90 active:bg-danger/80",
  success: "bg-verified text-white hover:bg-verified/90 active:bg-verified/80",
};

const sizes = {
  sm: "h-8 px-3 text-body-sm gap-1.5 rounded-md",
  md: "h-10 px-4 text-body-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-body gap-2 rounded-lg",
  icon: "h-9 w-9 rounded-md justify-center",
};

function Spinner() {
  return (
    <span
      className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

function renderIcon(Icon, size) {
  if (!Icon) return null;
  if (isValidElement(Icon)) {
    return cloneElement(Icon, { size, "aria-hidden": true });
  }
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * ProofHire button.
 * Renders an anchor when `href` is given and a router Link when `to` is
 * given — same visual API across all three elements. Focus rings come from
 * the global :focus-visible treatment in globals.css.
 */
const Button = forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    loading = false,
    leadingIcon: LeadingIcon,
    trailingIcon: TrailingIcon,
    className = "",
    children,
    to,
    href,
    ...props
  },
  ref
) {
  const classes = `inline-flex select-none items-center justify-center whitespace-nowrap font-medium transition-colors duration-150 ease-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
    variants[variant]
  } ${sizes[size]} ${className}`;

  if (to && !disabled && !loading) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {renderIcon(LeadingIcon, size === "sm" ? 14 : 16)}
        {children}
        {renderIcon(TrailingIcon, size === "sm" ? 14 : 16)}
      </Link>
    );
  }

  if (href && !disabled && !loading) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {renderIcon(LeadingIcon, size === "sm" ? 14 : 16)}
        {children}
        {renderIcon(TrailingIcon, size === "sm" ? 14 : 16)}
      </a>
    );
  }

  const isDisabled = disabled || loading;
  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={classes}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        renderIcon(LeadingIcon, size === "sm" ? 14 : 16)
      )}
      {children}
      {!loading && renderIcon(TrailingIcon, size === "sm" ? 14 : 16)}
    </button>
  );
});

export default Button;
