import AuthLayout from "@/components/AuthLayout";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-reuse-bg animate-page-in">
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </main>
  );
}
