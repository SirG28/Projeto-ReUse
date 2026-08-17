import BottomNav from "@/components/BottomNav";
import { ToastProvider } from "@/components/ToastProvider";
import { requireSession } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Checagem de sessão feita no servidor via Prisma (tabela Session) —
  // redireciona para /login se o cookie não corresponder a uma sessão válida.
  await requireSession();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-reuse-bg pb-28">
        {children}
        <BottomNav />
      </div>
    </ToastProvider>
  );
}
