import { useState } from "react";

export default function InputGitHub({ onSubmit }) {
  const [username, setUsername] = useState("");
  return (
    <div>
      <h2>GitHub Profile</h2>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="GitHub username" />
      <button onClick={() => onSubmit?.(username)}>Fetch</button>
    </div>
  );
}
