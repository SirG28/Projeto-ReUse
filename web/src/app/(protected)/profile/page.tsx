import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";
import SecondaryButton from "@/components/SecondaryButton";

export default async function ProfilePage() {
  const user = await requireSession();
  const inicial = user.name?.charAt(0).toUpperCase() ?? "U";

  return (
    <div className="animate-page-in">
      <div className="flex h-14 items-center border-b border-reuse-header-border px-4">
        <h1 className="text-lg font-bold text-reuse-text">Perfil</h1>
      </div>

      <div className="flex flex-col px-5 pt-2 pb-1 leading-tight">
        <div
          className="mx-auto mb-1.5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ backgroundColor: "#DCE8C2" }}
        >
          <span className="text-xl font-bold text-reuse-green-dark">
            {inicial}
          </span>
        </div>

        <h2 className="mb-0.5 text-center text-lg font-bold text-reuse-text">
          {user.name}
        </h2>
        <p className="mb-2 text-center text-xs text-reuse-text-secondary">
          {user.email}
        </p>

        <div className="rounded-2xl border border-reuse-border bg-white p-3">
          <h3 className="mb-1.5 text-sm font-bold text-reuse-text">Conta</h3>

          <div className="mb-1.5">
            <p className="text-[11px] text-reuse-text-secondary">Nome</p>
            <p className="text-sm font-medium text-reuse-text">
              {user.name}
            </p>
          </div>

          <div className="mb-1.5">
            <p className="text-[11px] text-reuse-text-secondary">
              E-mail
            </p>
            <p className="text-sm font-medium text-reuse-text">
              {user.email}
            </p>
          </div>

          {user.cidade ? (
            <div className="mb-1.5">
              <p className="text-[11px] text-reuse-text-secondary">
                Cidade
              </p>
              <p className="text-sm font-medium text-reuse-text">
                {user.cidade}
                {user.estado ? ` - ${user.estado}` : ""}
              </p>
            </div>
          ) : null}

          <div>
            <p className="text-[11px] text-reuse-text-secondary">
              Sessão
            </p>
            <p className="text-sm font-medium text-reuse-text">Ativa</p>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-1.5">
          <Link
            href="/items/mine"
            className="block w-full rounded-xl bg-reuse-green-dark py-3 text-center text-lg font-bold text-white"
          >
            Meus Itens
          </Link>

          <form action={logoutAction}>
            <SecondaryButton type="submit">Sair da conta</SecondaryButton>
          </form>
        </div>
      </div>
    </div>
  );
}
