import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ email: "", full_name: "", password: "" });
  return (
    <div className="container">
      <h1>Signup</h1>
      <form onSubmit={(e) => { e.preventDefault(); alert("signup placeholder"); }}>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" />
        <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="Full Name" />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}
