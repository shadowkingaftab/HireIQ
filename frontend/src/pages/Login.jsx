import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={(e) => { e.preventDefault(); alert("login placeholder"); }}>
        <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Username" />
        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
