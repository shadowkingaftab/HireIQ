import { useState } from "react";

export default function GraphControls({ onFilter, onReset }) {
  const [depth, setDepth] = useState(1);
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <label>Depth</label>
      <input type="number" value={depth} onChange={(e) => setDepth(Number(e.target.value))} min={1} max={5} />
      <button onClick={() => onFilter?.(depth)}>Filter</button>
      <button onClick={onReset}>Reset</button>
    </div>
  );
}
