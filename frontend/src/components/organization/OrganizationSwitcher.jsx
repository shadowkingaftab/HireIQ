import { useState } from "react";

export default function OrganizationSwitcher({ organizations = [], onSelect }) {
  const [selected, setSelected] = useState(organizations[0]?.id || null);
  return (
    <div>
      <label>Organization</label>
      <select value={selected} onChange={(e) => { setSelected(Number(e.target.value)); onSelect?.(Number(e.target.value)); }}>
        {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
      </select>
    </div>
  );
}
