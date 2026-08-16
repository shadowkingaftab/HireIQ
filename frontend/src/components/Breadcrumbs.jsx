import { Link } from "react-router-dom";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="breadcrumb" style={{ display: "flex", gap: 8, fontSize: 14 }}>
      {items.map((item, index) => (
        <span key={index}>
          {index > 0 && <span style={{ color: "#64748b" }}>/</span>}
          {item.href ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
