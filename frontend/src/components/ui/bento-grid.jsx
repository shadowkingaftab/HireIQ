import { cn } from "@/lib/utils";

export const BentoGrid = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn(
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[15rem] md:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}) => {
  return (
    <div
      className={cn(
        "group/bento row-span-1 flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_22px_70px_-38px_rgba(0,0,0,0.9)] backdrop-blur-md transition duration-300 hover:border-electric/30 hover:bg-white/[0.07] sm:p-6",
        className,
      )}
    >
      {header}
      <div className="transition duration-200 group-hover/bento:translate-x-2">
        {icon}
        <h3 className="mt-2 mb-2 text-section-sm font-semibold text-stellar">
          {title}
        </h3>
        <p className="max-w-prose text-body-sm font-normal leading-relaxed text-nebula">
          {description}
        </p>
      </div>
    </div>
  );
};
