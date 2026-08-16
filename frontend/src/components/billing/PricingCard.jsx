export default function PricingCard({ title, price, features, onSelect }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 8, padding: 24, width: 260 }}>
      <h3>{title}</h3>
      <div style={{ fontSize: 32, fontWeight: 700 }}>{price}</div>
      <ul>
        {features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      <button onClick={onSelect}>Select</button>
    </div>
  );
}
