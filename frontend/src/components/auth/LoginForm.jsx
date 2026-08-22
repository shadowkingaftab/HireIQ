import { useState } from "react";

export default function LoginForm({ onSubmit }) {
  const [form, setForm] = useState({ username: "", password: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(form); }}>
      <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
