import AuthLayout from "../components/auth/AuthLayout";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start turning real work into verifiable capability."
    >
      <SignupForm />
    </AuthLayout>
  );
}
