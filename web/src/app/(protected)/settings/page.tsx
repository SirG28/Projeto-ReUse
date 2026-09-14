import { requireSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import Button from "@/components/Button";
import ScreenHeader from "@/components/ScreenHeader";

export default async function SettingsPage() {
  const user = await requireSession();

  return (
    <div className="animate-page-in">
      <ScreenHeader title="Configurações" backHref="/profile" />

      <div className="px-5 pt-4 md:mx-auto md:max-w-md">
        <div className="mb-4 rounded-2xl border border-reuse-border bg-white p-3">
          <h3 className="mb-1.5 text-sm font-bold text-reuse-text">Conta</h3>

          <div className="mb-1.5">
            <p className="text-[11px] text-reuse-text-secondary">Nome</p>
            <p className="text-sm font-medium text-reuse-text">
              {user.name}
            </p>
          </div>

          <div className="mb-1.5">
            <p className="text-[11px] text-reuse-text-secondary">E-mail</p>
            <p className="text-sm font-medium text-reuse-text">
              {user.email}
            </p>
          </div>

          {user.cidade ? (
            <div className="mb-1.5">
              <p className="text-[11px] text-reuse-text-secondary">Cidade</p>
              <p className="text-sm font-medium text-reuse-text">
                {user.cidade}
                {user.estado ? ` - ${user.estado}` : ""}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-[11px] text-reuse-text-secondary">Sessão</p>
            <p className="text-sm font-medium text-reuse-text">Ativa</p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button type="submit" variant="secondary">Sair da conta</Button>
        </form>
      </div>
    </div>
  );
}
