import { cookies } from "next/headers";
import AuthLayout from "@/components/AuthLayout";
import LoginForm from "./LoginForm";

const REMEMBER_COOKIE = "reuse_remember_email";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const rememberedEmail = cookieStore.get(REMEMBER_COOKIE)?.value ?? "";

  return (
    <main className="min-h-screen bg-reuse-bg animate-page-in">
      <AuthLayout>
        <LoginForm
          defaultEmail={rememberedEmail}
          defaultRemember={Boolean(rememberedEmail)}
        />
      </AuthLayout>
    </main>
  );
}
