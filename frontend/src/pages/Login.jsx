import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Your evidence workspace is waiting."
    >
      <LoginForm />
    </AuthLayout>
  );
}
