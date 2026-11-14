import Mascot from "./Mascot";
import { brand } from "../utils/brand";
import darkWordmark from "../assets/brand/orionet-wordmark.svg";
import lightWordmark from "../assets/brand/orionet-wordmark-light.svg";

export default function BrandLogo({
  variant = "compact",
  tone = "dark",
  className = "",
}) {
  const iconOnly = variant === "icon";
  const mascotSize = iconOnly ? "h-8 w-12" : variant === "full" ? "h-10 w-[60px]" : "h-7 w-[42px]";
  const wordmarkSize = variant === "full" ? "h-6" : "h-[18px]";

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
        <img
          src={tone === "light" ? darkWordmark : lightWordmark}
          alt={brand.name}
          className={`${wordmarkSize} w-auto max-w-[112px] object-contain`}
        />
      )}
    </span>
  );
}
