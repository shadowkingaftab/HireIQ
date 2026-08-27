import Badge from "../ui/Badge";

const statusTone = { paid: "success", due: "warning", overdue: "danger" };

/** Invoice list — answers "what have we been billed and has it cleared?" */
export default function BillingHistory({ items = [], className = "" }) {
  if (!items.length) return null;
  return (
    <div className={`panel p-5 ${className}`}>
      <h3 className="text-micro font-medium uppercase tracking-caps text-intel">Recent invoices</h3>
      <ul role="list" className="mt-3 divide-y divide-line-subtle/60">
        {items.map((inv) => (
          <li key={inv.id} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
            <div>
              <span className="numeric font-mono text-body-sm text-ink-hi">{inv.id}</span>
              <span className="ml-3 text-meta text-ink-muted">{new Date(inv.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="numeric font-mono text-body-sm text-ink-hi">{inv.amount}</span>
              <Badge tone={statusTone[inv.status] || "neutral"} size="sm" dot>{inv.status}</Badge>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
