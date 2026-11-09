import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { toast } from "../../store/toastStore";
import { isEmail, isRequired, hasMinLength, passwordsMatch } from "../../utils/validators";
import Input from "../ui/Input";
import Button from "../ui/Button";
import Divider from "../ui/Divider";
import AuthError from "./AuthError";
import { describeAuthError } from "./authErrors";

const PASSWORD_MIN = 8;

/**
 * Account creation form. The backend has no /signup route yet; the request is
 * sent to the existing service layer so it works the moment the endpoint
 * ships. Until then failures surface through the honest error path.
 */
export default function SignupForm() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
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
    if (!isRequired(form.name)) errors.name = "Enter your full name.";
    if (!isRequired(form.email)) errors.email = "Enter your email.";
    else if (!isEmail(form.email)) errors.email = "That doesn't look like a valid email.";
    if (!hasMinLength(form.password, PASSWORD_MIN)) {
      errors.password = `Use at least ${PASSWORD_MIN} characters.`;
    }
    if (!passwordsMatch(form.password, form.confirm)) {
      errors.confirm = "Passwords don't match.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const establishSession = async (token) => {
    setUser(null);
    setToken(token);
    try {
      const me = await authApi.me();
      if (me?.user) setUser(me.user);
    } catch {
      // Session valid without profile; role checks defer gracefully.
    }
    navigate("/dashboard", { replace: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (submitting || !validate()) return;
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await authApi.signup({
        full_name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      const token = res?.access_token ?? res?.token;
      if (token) {
        await establishSession(token);
      } else {
        // Endpoint responded without a session — treat as created, route to sign-in.
        toast.success("Account created. Sign in to continue.");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      if (err.status === 409) {
        setFieldErrors({ email: "An account with this email already exists." });
      } else {
        setServerError(describeAuthError(err));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <AuthError message={serverError} />

      <Input
        label="Full name"
        type="text"
        name="name"
        autoComplete="name"
        placeholder="Aftab Sayed"
        value={form.name}
        onChange={setField("name")}
        error={fieldErrors.name}
        disabled={submitting}
        required
      />

      <Input
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={form.email}
        onChange={setField("email")}
        error={fieldErrors.email}
        disabled={submitting}
        required
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:items-start">
        <Input
          label="Password"
          type="password"
          name="new-password"
          autoComplete="new-password"
          placeholder={`${PASSWORD_MIN}+ characters`}
          value={form.password}
          onChange={setField("password")}
          error={fieldErrors.password}
          description={`At least ${PASSWORD_MIN} characters.`}
          disabled={submitting}
          required
        />
        <Input
          label="Confirm password"
          type="password"
          name="confirm-password"
          autoComplete="new-password"
          placeholder="Repeat password"
          value={form.confirm}
          onChange={setField("confirm")}
          error={fieldErrors.confirm}
          disabled={submitting}
          required
        />
      </div>

      <Button type="submit" loading={submitting} disabled={submitting} className="mt-1 w-full">
        {submitting ? "Creating account…" : "Create account"}
      </Button>

      <p className="text-center text-micro leading-relaxed text-ink-faint">
        You control what evidence is shared. Public profiles are opt-in.
      </p>

      <Divider label="already have an account" />
      <p className="text-center text-body-sm text-ink-muted">
        <Link
          to="/login"
          className="rounded font-medium text-intel transition-colors hover:text-intel-firm focus-visible:outline-none"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
