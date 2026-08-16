import { useState } from "react";

export default function SignupForm({ onSubmit }) {
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit?.(form); }}>
      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
      <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" />
      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button type="submit">Signup</button>
    </form>
  );
}
