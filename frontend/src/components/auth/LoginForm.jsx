import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { isRequired } from "../../utils/validators";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Divider from "../ui/Divider";
import AuthError from "./AuthError";
import { describeAuthError } from "./authErrors";

/**
 * Sign-in form. Sends the backend `Login` contract ({ username, password})
 * and expects the Token contract ({ access_token }) on success.
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const setField = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
    setServerError(null);
  };

  const validate = () => {
    const errors = {};
    if (!isRequired(form.identifier)) errors.identifier = "Enter your email or username.";
    if (!isRequired(form.password)) errors.password = "Enter your password.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authApi.login({
        username: form.identifier.trim(),
        password: form.password,
      });
      const token = res?.access_token ?? res?.token;
      if (!token) {
        setServerError("The service accepted the request but didn't start a session. Please try again.");
        return;
      }
      setToken(token);
      try {
        const me = await authApi.me();
        if (me?.user) setUser(me.user);
      } catch {
        // Session is valid without profile data; role checks defer gracefully.
      }
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setServerError(describeAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthError message={serverError} />

      <Input
        label="Email or username"
        type="text"
        name="username"
        autoComplete="username"
        placeholder="you@company.com"
        value={form.identifier}
        onChange={setField("identifier")}
        error={fieldErrors.identifier}
        disabled={submitting}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="Your password"
        value={form.password}
        onChange={setField("password")}
        error={fieldErrors.password}
        disabled={submitting}
        required
      />

      <Button
        type="submit"
        loading={submitting}
        disabled={submitting}
        className="mt-1 w-full"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </Button>

      <Divider label="new to proofhire" />
      <p className="text-center text-body-sm text-ink-muted">
        Create an account{" "}
        <Link
          to="/signup"
          className="rounded font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none"
        >
          Build your proof
        </Link>
      </p>
    </form>
  );
}
