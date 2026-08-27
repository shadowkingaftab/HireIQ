import Button from "../ui/Button";
import Badge from "../ui/Badge";
import { Check } from "lucide-react";

/** Pricing tile — the billing context in Settings/Billing. */
export default function PricingCard({ name, price, period, features = [], current = false, className = "" }) {
  return (
    <div
      className={`panel flex flex-col gap-5 p-6 ${
        current ? "border-intel/30" : "border-line-subtle"
      } ${className}`}
    >
      <div>
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-section-sm font-semibold text-ink-hi">{name} plan</h3>
          {current && <Badge tone="success" size="sm">current</Badge>}
        </div>
        <p className="mt-2 flex items-baseline gap-1">
          <span className="numeric font-mono text-display font-bold text-ink-hi">{price}</span>
          {period && <span className="text-meta text-ink-muted">{period}</span>}
        </p>
      </div>
      <ul role="list" className="flex flex-1 flex-col gap-2">
        {features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-body-sm text-ink-med">
            <Check size={14} aria-hidden="true" className="mt-0.5 shrink-0 text-verified" />
            {feat}
          </li>
        ))}
      </ul>
      {current ? (
        <Button variant="secondary" className="w-full" disabled>Current plan</Button>
      ) : (
        <Button className="w-full">Upgrade</Button>
      )}
    </div>
  );
}
