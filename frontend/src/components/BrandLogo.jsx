import Mascot from "./Mascot";
import { brand } from "../utils/brand";

export default function BrandLogo({
  variant = "compact",
  tone = "dark",
  className = "",
}) {
  const iconOnly = variant === "icon";
  const wordmarkClass = tone === "light" ? "text-[#071746]" : "text-white";
  const mascotSize = iconOnly ? "h-8 w-12" : variant === "full" ? "h-10 w-[60px]" : "h-7 w-[42px]";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-2.5 ${className}`.trim()}
      aria-label={iconOnly ? brand.name : undefined}
    >
      <Mascot
        className={`${mascotSize} shrink-0 object-contain`}
        title={iconOnly ? brand.name : ""}
      />
      {!iconOnly && (
        <span className={`font-semibold tracking-[-0.04em] ${wordmarkClass} ${variant === "full" ? "text-lg" : "text-sm"}`}>
          {brand.name}
        </span>
      )}
    </span>
  );
}
