import { useState } from "react";

export default function InputJD({ onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div>
      <h2>Job Description</h2>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste job description..." />
      <button onClick={() => onSubmit?.(text)}>Parse</button>
    </div>
  );
}
