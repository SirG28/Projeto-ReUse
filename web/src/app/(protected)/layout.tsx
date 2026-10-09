import { logoutAction } from "@/app/actions/auth";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ToastProvider } from "@/components/ToastProvider";
import { requireSession } from "@/lib/auth";
import Script from "next/script";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checagem de sessão feita no servidor via Prisma (tabela Session) —
  // redireciona para /login se o cookie não corresponder a uma sessão válida.
  const user = await requireSession();

  return (
    <ToastProvider>
      <div className="flex min-h-screen flex-col bg-reuse-bg">
        <SiteHeader
          userName={user.name}
          userCidade={user.cidade}
          userEstado={user.estado}
          logoutAction={logoutAction}
        />
        <main className="mx-auto w-full max-w-5xl flex-1">{children}</main>
        <SiteFooter logoutAction={logoutAction} />
      </div>
      <Script src="/watsonx-chat.js" strategy="afterInteractive" />
    </ToastProvider>
  );
}
