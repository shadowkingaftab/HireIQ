export default function BillingHistory({ invoices = [] }) {
  return (
    <div>
      <h3>Billing History</h3>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>{invoice.id}: {invoice.amount}</li>
        ))}
      </ul>
    </div>
  );
}
